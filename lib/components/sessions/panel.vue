<template>
    <ext-panel ref="cards" layout="card">
        <ext-toolbar docked="top">
            <ext-spacer/>
            <ext-button iconCls="fa-solid fa-redo" :text="i18nd(`vue-ext`, `Refresh`)" @tap="reload"/>
        </ext-toolbar>

        <!-- no-data card -->
        <ext-container ref="noDataCard" :html="i18nd(`vue-ext`, `No records match search criteria`)" layout="center" style="text-align: center"/>

        <!-- error card -->
        <ext-container ref="errorCard" layout='{"align":"center","pack":"center","type":"vbox"}' style="text-align: center">
            <ext-container :html="i18nd(`vue-ext`, `Unable to load records`)"/>
            <ext-button iconCls="fa-solid fa-redo" :text="i18nd(`vue-ext`, `Refresh`)" ui="action" @tap="reload"/>
        </ext-container>

        <!-- data card -->
        <ext-grid ref="dataCard" layout="fit" multicolumnSort="true" plugins='{"gridsummaryrow":true}' @ready="_gridReady">
            <ext-column dataIndex="user_agent" flex="1" :text="i18nd(`vue-ext`, `User agent`)"/>

            <ext-column dataIndex="remmote_address" :text="i18nd(`vue-ext`, `IP address`)" width="100"/>

            <ext-column cell='{"encodeHtml":false}' dataIndex="last_activity_text" sorter='{"property":"last_activity"}' :text="i18nd(`vue-ext`, `Last activity`)" width="150"/>

            <ext-column dataIndex="created" formatter="date()" :text="i18nd(`vue-ext`, `Creation date`)" width="150"/>

            <ext-column width="50" @ready="_actionColReady"/>
        </ext-grid>
    </ext-panel>
</template>

<script>
import SessionModel from "./models/session";
import loadMask from "#vue/load-mask";

export default {
    created () {
        this.store = Ext.create( "Ext.data.Store", {
            "model": SessionModel,
            "autoLoad": false,
            "pageSize": null,
            "remoteSort": false,
            "remoteFilter": false,
        } );

        this.store.on( "load", this._onStoreLoad.bind( this ) );
    },

    "methods": {
        _gridReady ( e ) {
            var grid = e.detail.cmp;

            grid.setPlugins( ["gridviewoptions"] );

            grid.setItemConfig( { "viewModel": true } );

            grid.setStore( this.store );

            this.reload();
        },

        _actionColReady ( e ) {
            var cmp = e.detail.cmp;

            cmp.setCell( {
                "xtype": "widgetcell",
                "widget": {
                    "xtype": "container",
                    "layout": { "type": "hbox", "pack": "center", "align": "center" },
                    "items": [
                        {
                            "xtype": "button",
                            "iconCls": "fa-solid fa-sign-out-alt",
                            "tooltip": this.i18nd( `vue-ext`, "Signout" ),
                            "handler": this.deleteSession.bind( this ),
                            "bind": { "hidden": "{record.current_session}" },
                        },
                    ],
                },
            } );
        },

        // XXX
        async deleteSession ( button ) {
            const gridrow = button.up( "gridrow" ),
                record = gridrow.getRecord();

            button.disable();

            var res = await this.$api.call( "admin/users/delete-sessions", record.getId() );

            button.enable();

            if ( res.ok ) {
                this.$utils.toast( this.i18nd( `vue-ext`, "Sessions were deleted" ) );
            }
            else {
                this.$utils.toast( res );
            }
        },

        // XXX
        async dropSessions ( button ) {
            const gridrow = button.up( "gridrow" ),
                record = gridrow.getRecord();

            button.disable();

            var res = await this.$api.call( "admin/users/delete-sessions", record.getId() );

            button.enable();

            if ( res.ok ) {
                this.$utils.toast( this.i18nd( `vue-ext`, "Sessions were deleted" ) );
            }
            else {
                this.$utils.toast( res );
            }
        },

        async reload () {
            this.$refs.cards.ext.mask( loadMask );

            const res = await this.$api.call( "session/get-sessions" );

            this.$refs.cards.ext.unmask();

            if ( !res.ok ) {
                this.$utils.toast( res );

                this.$refs.cards.ext.setActiveItem( this.$refs.errorCard.ext );
            }
            else {
                this.store.loadRawData( res.data );
            }
        },

        _onStoreLoad ( store, records, success ) {
            if ( !this.store.count() ) {
                this.$refs.cards.ext.setActiveItem( this.$refs.noDataCard.ext );
            }
            else {
                this.$refs.cards.ext.setActiveItem( this.$refs.dataCard.ext );
            }
        },
    },
};
</script>

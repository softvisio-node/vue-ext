<template>
    <ext-panel ref="cards" layout="card">
        <ext-toolbar docked="top">
            <ext-container :html="title"/>
            <ext-spacer/>
            <ext-button iconCls="fa-solid fa-sign-out-alt" :text="i18nd(`vue-ext`, `Sign out of all sessions`)" @tap="_signOutAllSessions"/>
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
        <ext-grid ref="dataCard" layout="fit" multicolumnSort="true" plugins='{"gridviewoptions":true}' @ready="_gridReady">
            <ext-column cell='{"encodeHtml":false}' dataIndex="device_text" flex="1" sorter='{"property":"device_vendor"}' :text="i18nd(`vue-ext`, `Device`)"/>

            <ext-column cell='{"encodeHtml":false}' dataIndex="os_text" flex="1" sorter='{"property":"os_name"}' :text="i18nd(`vue-ext`, `Platform`)"/>

            <ext-column cell='{"encodeHtml":false}' dataIndex="browser_text" flex="1" sorter='{"property":"browser_name"}' :text="i18nd(`vue-ext`, `Browser`)"/>

            <ext-column dataIndex="remote_address" :text="i18nd(`vue-ext`, `IP address`)" width="130"/>

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
    "computed": {
        title () {
            return this.i18nd( `vue-ext`, `Your sessions` );
        },
    },

    created () {
        this.store = Ext.create( "Ext.data.Store", {
            "model": SessionModel,
            "autoLoad": false,
            "pageSize": null,
            "remoteSort": false,
            "remoteFilter": false,
        } );

        this.store.on( "datachanged", this._onStoreChanged.bind( this ) );
    },

    "methods": {
        _gridReady ( e ) {
            var grid = e.detail.cmp;

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
                            "tooltip": this.i18nd( `vue-ext`, "Sign out" ),
                            "handler": this._signOutSession.bind( this ),
                            "bind": { "hidden": "{record.current_session}" },
                        },
                    ],
                },
            } );
        },

        async _signOutSession ( button ) {
            const record = button.lookupViewModel().get( "record" );

            button.disable();

            const res = await this._signOutSessionRequest( record.id );

            button.enable();

            if ( res.ok ) {
                this.$utils.toast( this.i18nd( `vue-ext`, "Session was deleted" ) );

                this.store.remove( record );
            }
            else {
                this.$utils.toast( res );
            }
        },

        async _signOutAllSessions ( e ) {
            const button = e.detail.sender;

            button.disable();

            const res = await this._signOutAllSessionsRequest();

            button.enable();

            if ( !res.ok ) {
                this.$utils.toast( res );
            }
            else {
                this.$utils.toast( this.i18nd( `vue-ext`, "Sessions were deleted" ) );

                this.reload();
            }
        },

        async reload () {
            this.$refs.cards.ext.mask( loadMask );

            const res = await this._loadSessions();

            this.$refs.cards.ext.unmask();

            if ( !res.ok ) {
                this.$utils.toast( res );

                this.$refs.cards.ext.setActiveItem( this.$refs.errorCard.ext );
            }
            else {
                this.store.loadRawData( res.data );
            }
        },

        _onStoreChanged ( store, records, success ) {
            if ( !this.store.count() ) {
                this.$refs.cards.ext.setActiveItem( this.$refs.noDataCard.ext );
            }
            else {
                this.$refs.cards.ext.setActiveItem( this.$refs.dataCard.ext );
            }
        },

        async _loadSessions () {
            return this.$api.call( "session/get-sessions" );
        },

        async _signOutSessionRequest ( sessionId ) {
            return this.$api.call( "session/signout", sessionId );
        },

        async _signOutAllSessionsRequest () {
            return this.$api.call( "session/signout-all-sessions" );
        },
    },
};
</script>

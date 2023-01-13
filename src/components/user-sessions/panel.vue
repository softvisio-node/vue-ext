<template>
    <CardsPanel ref="cards" :store="store" @reload="reload">
        <template #items>
            <ext-toolbar docked="top">
                <ext-container :html="title"/>
                <ext-spacer/>
                <ext-button iconCls="fa-solid fa-sign-out-alt" :text="i18nd(`vue-ext`, `Sign out of all sessions`)" @tap="_signOutAllSessions"/>
                <ext-button iconCls="fa-solid fa-redo" :text="i18nd(`vue-ext`, `Refresh`)" @tap="reload"/>
            </ext-toolbar>
        </template>

        <template #data>
            <ext-grid layout="fit" multicolumnSort="true" plugins='{"gridviewoptions":true}' @ready="_gridReady">
                <ext-column cell='{"encodeHtml":false}' dataIndex="device_text" flex="1" sorter='{"property":"device_vendor"}' :text="i18nd(`vue-ext`, `Device`)"/>

                <ext-column cell='{"encodeHtml":false}' dataIndex="os_text" flex="1" sorter='{"property":"os_name"}' :text="i18nd(`vue-ext`, `Platform`)"/>

                <ext-column cell='{"encodeHtml":false}' dataIndex="browser_text" flex="1" sorter='{"property":"browser_name"}' :text="i18nd(`vue-ext`, `Browser`)"/>

                <ext-column dataIndex="remote_address" :text="i18nd(`vue-ext`, `IP address`)" width="130"/>

                <ext-column cell='{"encodeHtml":false}' dataIndex="last_activity_text" sorter='{"property":"last_activity"}' :text="i18nd(`vue-ext`, `Last activity`)" width="150"/>

                <ext-column dataIndex="created" formatter="date()" :text="i18nd(`vue-ext`, `Creation date`)" width="150"/>

                <ext-column width="50" @ready="_actionColReady"/>
            </ext-grid>
        </template>
    </CardsPanel>
</template>

<script>
import SessionModel from "./models/session";
import CardsPanel from "#src/components/cards.panel";

export default {
    "components": { CardsPanel },

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
            this.$refs.cards.mask();

            const res = await this._loadSessions();

            this.$refs.cards.unmask();

            if ( !res.ok ) {
                this.$refs.cards.setResult( res );

                this.$utils.toast( res );
            }
            else {
                this.store.loadRawData( res.data );
            }
        },

        async _loadSessions () {
            return this.$api.call( "account/get-sessions" );
        },

        async _signOutSessionRequest ( sessionId ) {
            return this.$api.call( "account/signout-session", sessionId );
        },

        async _signOutAllSessionsRequest () {
            return this.$api.call( "account/signout-all-sessions" );
        },
    },
};
</script>

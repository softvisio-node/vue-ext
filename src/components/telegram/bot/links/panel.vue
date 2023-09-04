<template>
    <CardsPanel ref="cards" :store="store" @refresh="refresh">
        <template #docked>
            <ext-toolbar docked="top">
                <ext-searchfield :placeholder="l10nd(`vue-ext`, `Search bots`)" width="200" @change="_search"/>
                <ext-spacer/>
                <ext-button iconCls="fa-solid fa-redo" :text="l10nd(`vue-ext`, `Refresh`)" @tap="refresh"/>
            </ext-toolbar>
        </template>

        <template #data>
            <ext-grid itemConfig='{"viewModel":true}' layout="fit" multicolumnSort="true" plugins='["gridviewoptions", "autopaging"]' @ready="_onGridReady">
                <ext-column dataIndex="telegram_username" :text="l10nd(`vue-ext`, `Name`)" width="200"/>

                <ext-column dataIndex="type" :text="l10nd(`vue-ext`, `Type`)" width="200"/>

                <ext-column dataIndex="static" :text="l10nd(`vue-ext`, `Static`)"/>

                <ext-numbercolumn align="right" dataIndex="total_subscribed_users" :text="l10nd(`vue-ext`, `Users`)"/>

                <ext-column dataIndex="error_text" flex="1" :text="l10nd(`vue-ext`, `Error`)"/>

                <ext-column width="120" @ready="_actionColReady"/>
            </ext-grid>
        </template>
    </CardsPanel>
</template>

<script>
import CardsPanel from "#src/components/cards.panel";
import TelegramBotAdCampaignModel from "./models/ad-campaign";

export default {
    "components": { CardsPanel },

    "props": {
        "telegramBotId": {
            "type": String,
            "required": true,
        },
    },

    data () {
        return {
            "canUpdate": this.$app.user.hasPermissions( "administration:update" ),
            "canDelete": this.$app.user.hasPermissions( "administration:delete" ),
        };
    },

    created () {
        this.store = Ext.create( "Ext.data.Store", {
            "model": TelegramBotAdCampaignModel,
            "autoLoad": false,
            "pageSize": 50,
            "proxy": {
                "api": {
                    "read": "administration/telegram/bots/ad-campaigns/read",
                },
                "filter": {
                    "property": "bot_id",
                    "operator": "=",
                    "value": this.telegramBotId,
                },
            },
        } );
    },

    "methods": {

        // public
        async refresh () {
            this.store.loadPage( 1 );
        },

        // protected
        _onGridReady ( e ) {
            const cmp = e.detail.cmp;

            cmp.setStore( this.store );
        },

        _actionColReady ( e ) {
            const cmp = e.detail.cmp;

            cmp.setCell( {
                "xtype": "widgetcell",
                "widget": {
                    "xtype": "container",
                    "layout": { "type": "hbox", "pack": "end", "align": "center" },
                    "items": [
                        {
                            "xtype": "button",
                            "iconCls": "fa-regular fa-circle-play",
                            "text": this.l10nd( `vue-ext`, "Start" ),
                            "handler": this._startBot.bind( this ),
                            "bind": { "hidden": "{record.started}" },
                            "disabled": !this.canUpdate,
                            "ui": "decline",
                        },
                        {
                            "xtype": "button",
                            "iconCls": "fa-regular fa-circle-stop",
                            "text": this.l10nd( `vue-ext`, "Stop" ),
                            "handler": this._stopBot.bind( this ),
                            "bind": { "hidden": "{!record.started}" },
                            "disabled": !this.canUpdate,
                        },
                        {
                            "xtype": "button",
                            "iconCls": "fa-solid fa-ellipsis-v",
                            "tooltip": this.l10nd( `vue-ext`, "Actions" ),
                            "arrow": false,
                            "menu": {
                                "defaults": {
                                    "xtype": "menuitem",
                                },
                                "items": [
                                    {
                                        "iconCls": "fa-solid fa-trash-alt",
                                        "text": this.l10nd( `vue-ext`, "Delete bot" ),
                                        "handler": this._deleteBot.bind( this ),
                                        "disabled": !this.canDelete,
                                    },
                                ],
                            },
                        },
                    ],
                },
            } );
        },

        _search ( e ) {
            var val = e.detail.newValue.trim();

            if ( val !== "" ) {
                this.store.addFilter( {
                    "property": "telegram_username",
                    "operator": "like",
                    "value": val,
                } );
            }
            else {
                this.store.removeFilter( "telegram_username" );
            }
        },

        async _startBot ( button ) {
            const record = button.up( "gridrow" ).getRecord();

            button.disable();

            const res = await this.$api.call( "administration/telegram/bots/set-bot-started", record.id, true );

            button.enable();

            if ( res.ok ) {
                record.set( "started", true );
                record.set( "error", false );
                record.set( "error_text", null );
            }
            else {
                this.$utils.toast( res );
                record.set( "error", true );
                record.set( "error_text", res.statusText );
            }
        },

        async _stopBot ( button ) {
            const record = button.up( "gridrow" ).getRecord();

            button.disable();

            const res = await this.$api.call( "administration/telegram/bots/set-bot-started", record.id, false );

            button.enable();

            if ( res.ok ) {
                record.set( "started", false );
            }
            else {
                this.$utils.toast( res );
            }
        },

        async _deleteBot ( button ) {
            const record = button.up( "gridrow" ).getRecord();

            button.disable();

            const res = await this.$api.call( "administration/telegram/bots/delete-bot", record.id );

            button.enable();

            if ( res.ok ) {
                this.refresh();
            }
            else {
                this.$utils.toast( res );
            }
        },
    },
};
</script>
<template>
    <CardsPanel ref="cards" :store="store" @refresh="refresh">
        <template #docked>
            <ext-toolbar docked="top">
                <ext-searchfield :placeholder="l10n(`Search bots`)" width="200" @change="_search"/>
                <ext-spacer/>
                <CreateBotButton/>
                <ext-button iconCls="fa-solid fa-redo" :text="l10n(`Refresh`)" @tap="refresh"/>
            </ext-toolbar>
        </template>

        <template #noDataPanel>
            <ext-panel layout='{"align":"center","pack":"center","type":"vbox"}'>
                <ext-container :html="l10n(`No Telegram bots found`)"/>
                <CreateBotButton ui="action"/>
            </ext-panel>
        </template>

        <template #dataPanel>
            <ext-grid itemConfig='{"viewModel":true}' layout="fit" multicolumnSort="true" plugins='["gridviewoptions", "autopaging"]' :store="store">
                <ext-column width="40" @ready="_avatarColReady"/>

                <ext-column dataIndex="name" flex="1" :text="l10n(`Name`)"/>

                <ext-column dataIndex="telegram_username" flex="1" :text="l10n(`Telegram username`)"/>

                <ext-column dataIndex="type_name" flex="1" sorter='{"property":"type"}' :text="l10n(`Bot type`)"/>

                <ext-column align="right" dataIndex="total_subscribed_users_text" sorter='{"property":"total_subscribed_users"}' :text="l10n(`Subscribed users`)" width="200"/>

                <ext-column dataIndex="status_text" sorter='{"property":"started"}' :text="l10n(`Status`)"/>

                <ext-column @ready="_actionColReady"/>
            </ext-grid>
        </template>
    </CardsPanel>
</template>

<script>
import CardsPanel from "#src/components/cards.panel";
import TelegramBotModel from "#src/components/telegram/bot/models/bot";
import CreateBotButton from "./create-bot.button";

export default {
    "components": { CardsPanel, CreateBotButton },

    "emits": ["openBot"],

    data () {
        return {
            "canUpdate": this.$app.user.hasPermissions( "administration:update" ),
            "canDelete": this.$app.user.hasPermissions( "administration:delete" ),
        };
    },

    created () {
        this.store = Ext.create( "Ext.data.Store", {
            "model": TelegramBotModel,
            "autoLoad": false,
            "pageSize": 50,
            "proxy": {
                "api": {
                    "read": "telegram/bots/get-bots-list",
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
        _avatarColReady ( e ) {
            const cmp = e.detail.cmp;

            cmp.setCell( {
                "xtype": "widgetcell",
                "widget": {
                    "xtype": "avatar",
                    "bind": "{record.avatar_url}",
                },
            } );
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

                            // "iconCls": "fa-solid fa-users",
                            "text": this.l10n( "Open bot" ),
                            "handler": this._openBot.bind( this ),
                        },
                    ],
                },
            } );
        },

        _search ( e ) {
            var val = e.detail.newValue.trim();

            if ( val !== "" ) {
                this.store.addFilter( {
                    "property": "name",
                    "operator": "like",
                    "value": val,
                } );
            }
            else {
                this.store.removeFilter( "name" );
            }
        },

        _openBot ( button ) {
            const record = button.up( "gridrow" ).getRecord();

            this.$emit( "openBot", record );
        },
    },
};
</script>

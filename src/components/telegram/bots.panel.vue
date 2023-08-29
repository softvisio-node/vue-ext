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
                <ext-column cell='{"encodeHtml":false}' dataIndex="name_html" flex="1" sorter='{"property":"name"}' :text="l10nd(`vue-ext`, `Name`)"/>

                <ext-column align="right" dataIndex="total_subscribed_users_text" sorter='{"property":"total_subscribed_users"}' :text="l10nd(`vue-ext`, `Subscribed users`)" width="200"/>

                <ext-column dataIndex="status_text" sorter='{"property":"started"}' :text="l10nd(`vue-ext`, `Status`)"/>

                <ext-column @ready="_actionColReady"/>
            </ext-grid>
        </template>
    </CardsPanel>
</template>

<script>
import CardsPanel from "#src/components/cards.panel";
import TelegramBotModel from "#src/components/telegram/bot/models/bot";
import registry from "#src/components/telegram/registry";
import BotDialog from "#src/components/telegram/dialog";

// XXX
import "#src/components/telegram/telegram-notifications-bot/index";

export default {
    "components": { CardsPanel },

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
                    "read": "telegram/bots/read",
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

                            // "iconCls": "fa-solid fa-users",
                            "text": this.l10nd( `vue-ext`, "Open bot" ),
                            "handler": this._showBotDialog.bind( this ),
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

        async _showBotDialog ( button ) {
            const record = button.up( "gridrow" ).getRecord(),
                panel = registry.getType( record.get( "type" ) );

            const cmp = await this.$mount( BotDialog, {
                "props": {
                    panel,
                    "telegramBotId": record.id,
                    "title": record.get( "name" ),
                },
            } );

            cmp.ext.show();
        },
    },
};
</script>

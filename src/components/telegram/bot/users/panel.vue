<template>
    <ext-panel ref="panel" layout="fit" viewModel="true">
        <CardsPanel ref="cardsPanel" :store="store" @refresh="refresh">
            <template #docked>
                <ext-toolbar docked="top">
                    <ext-searchfield :placeholder="l10n(`Search users`)" width="150" @change="_search"/>

                    <ext-spacer/>

                    <ext-button iconCls="fa-solid fa-redo" :text="l10n(`Refresh`)" @tap="refresh"/>

                    <ext-button iconCls="fa-solid fa-table-columns" pressed="true" :tooltip="l10n(`Toggle user details panel`)" @tap="toggleDetailsPanel"/>
                </ext-toolbar>
            </template>

            <template #dataPanel>
                <ext-grid itemConfig='{"viewModel":true}' layout="fit" multicolumnSort="true" padding="0 0 0 5" plugins='["gridviewoptions", "autopaging"]' @ready="_gridReady">
                    <ext-column width="40" @ready="_avatarColReady"/>

                    <ext-column dataIndex="username" flex="1" :text="l10n(`Username`)"/>

                    <ext-column dataIndex="full_name" flex="1" sorter='{"property":"first_name"}' :text="l10n(`Name`)"/>

                    <ext-column dataIndex="phone" flex="1" :text="l10n(`Phone`)"/>
                </ext-grid>
            </template>
        </CardsPanel>

        <!-- details panel -->
        <ext-panel ref="detailsPanel" docked="right" layout="fit" minWidth="400" resizable='{"edges":"west","snap":200,"split":true}' width="400">
            <DetailsPanel :telegramBotUserRecord="telegramBotUserRecord"/>
        </ext-panel>
    </ext-panel>
</template>

<script>
import CardsPanel from "#src/components/cards.panel";
import TelegramBotUserModel from "./models/user";
import "#src/components/avatar/ext.avatar";
import DetailsPanel from "./details.panel";
import TelegramBotModel from "../models/bot.js";

export default {
    "components": { CardsPanel, DetailsPanel },

    "props": {
        "telegramBotId": {
            "type": String,
            "required": true,
        },
    },

    data () {
        return {
            "telegramBotUserRecord": null,
        };
    },

    created () {
        this.store = Ext.create( "Ext.data.Store", {
            "model": TelegramBotUserModel,
            "autoLoad": false,
            "pageSize": 50,
            "filters": {
                "property": "telegram_bot_id",
                "operator": "=",
                "value": this.telegramBotId,
            },
        } );
    },

    "methods": {

        // public
        async refresh () {
            const res = await this.$api.call( "telegram/bots/get-bot", this.telegramBotId );

            if ( !res.ok ) {
                this.$refs.cardsPanel.setResult( res );
            }
            else {
                const telegramBotRecord = new TelegramBotModel( res.data );

                this.$refs.panel.ext.getViewModel().set( "telegramBotRecord", telegramBotRecord );

                this.store.loadPage( 1 );
            }
        },

        // protected
        _gridReady ( e ) {
            const cmp = e.detail.cmp;

            cmp.on( "select", ( grid, selection ) => ( this.telegramBotUserRecord = selection[0] ) );

            cmp.setStore( this.store );
        },

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

        _search ( e ) {
            var val = e.detail.newValue.trim();

            if ( val !== "" ) {
                this.store.addFilter( {
                    "property": "search",
                    "operator": "like",
                    "value": val,
                } );
            }
            else {
                this.store.removeFilter( "search" );
            }
        },

        toggleDetailsPanel ( e ) {
            const button = e.detail.sender,
                pressed = button.getPressed();

            button.setPressed( !pressed );

            if ( !pressed ) {
                this.$refs.detailsPanel.ext.show();
            }
            else {
                this.$refs.detailsPanel.ext.hide();
            }
        },
    },
};
</script>

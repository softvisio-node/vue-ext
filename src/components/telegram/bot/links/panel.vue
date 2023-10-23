<template>
    <ext-panel ref="panel" layout="fit" viewModel="true">
        <CardsPanel ref="cardsPanel" :store="store" @refresh="refresh">
            <template #docked>
                <ext-toolbar docked="top">
                    <ext-searchfield :placeholder="l10n(`Search links`)" width="150" @change="_search"/>

                    <ext-spacer/>

                    <ext-button bind='{"hidden":"{!telegramBotRecord.can_create_link}"}' iconCls="fa-solid fa-plus" :text="l10n(`Create link`)" @tap="_showCreateLinkDialog"/>

                    <ext-button iconCls="fa-solid fa-redo" :text="l10n(`Refresh`)" @tap="refresh"/>
                </ext-toolbar>
            </template>

            <template #noDataPanel>
                <ext-panel layout='{"align":"center","pack":"center","type":"vbox"}'>
                    <ext-container :html="l10n(`No links found`)"/>
                    <ext-button bind='{"hidden":"{!telegramBotRecord.can_create_link}"}' iconCls="fa-solid fa-plus" :text="l10n(`Create link`)" ui="action" @tap="_showCreateLinkDialog"/>
                </ext-panel>
            </template>

            <template #dataPanel>
                <ext-grid itemConfig='{"viewModel":true}' layout="fit" multicolumnSort="true" plugins='["gridviewoptions", "autopaging"]' :store="store" @ready="_gridReady">
                    <ext-column dataIndex="name" flex="1" :text="l10n(`Name`)"/>

                    <ext-column align="right" dataIndex="total_subscribed_users_text" sorter='{"property":"total_subscribed_users"}' :text="l10n(`Subscribed users`)" width="150"/>

                    <ext-column align="right" dataIndex="total_unsubscribed_users_text" sorter='{"property":"total_unsubscribed_users"}' :text="l10n(`Unsubscribed users`)" width="150"/>

                    <ext-column dataIndex="last_user_created_text" sorter='{"property":"last_user_created"}' :text="l10n(`Last user created`)" width="150"/>

                    <ext-column dataIndex="created_text" sorter='{"property":"created"}' :text="l10n(`Creation date`)" width="150"/>

                    <ext-column width="150" @ready="_actionColReady"/>
                </ext-grid>
            </template>
        </CardsPanel>

        <!-- details panel -->
        <ext-panel ref="detailsPanel" collapsible="right" docked="right" headerPosition="left" layout="fit" minWidth="400" resizable='{"edges":"west","snap":200,"split":true}' :title="l10n(`Link details`)" width="400">
            <DetailsPanel :telegramBotLinkRecord="telegramBotLinkRecord" @linkDelete="_onLinkDelete"/>
        </ext-panel>
    </ext-panel>
</template>

<script>
import CardsPanel from "#src/components/cards.panel";
import TelegramBotLinkModel from "./models/link";
import CreateLinkDialog from "./create.dialog";
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
            "telegramBotLinkRecord": null,
        };
    },

    created () {
        this.store = Ext.create( "Ext.data.Store", {
            "model": TelegramBotLinkModel,
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

            cmp.on( "select", ( grid, selection ) => ( this.telegramBotLinkRecord = selection[0] ) );
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
                            "iconCls": "fa-regular fa-copy",
                            "text": this.l10n( "Copy link" ),
                            "handler": this._copyLink.bind( this ),
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

        async _copyLink ( button ) {
            const record = button.up( "gridrow" ).getRecord();

            this.$utils.copyToClipboard( record.get( "link" ) );

            this.$toast( this.l10n( "Link copied to the clipboard" ) );
        },

        async _showCreateLinkDialog () {
            const cmp = await this.$mount( CreateLinkDialog, {
                "props": {
                    "telegramBotId": this.telegramBotId,
                    "onCreate": this.refresh.bind( this ),
                },
            } );

            cmp.ext.show();
        },

        _onLinkDelete ( telegramBotLinkrecord ) {
            this.telegramBotLinkRecord = null;

            this.refresh();
        },
    },
};
</script>

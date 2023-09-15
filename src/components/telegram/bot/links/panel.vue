<template>
    <CardsPanel ref="cards" :store="store" @refresh="refresh">
        <template #data>
            <ext-grid itemConfig='{"viewModel":true}' layout="fit" multicolumnSort="true" plugins='["gridviewoptions", "autopaging"]' @ready="_onGridReady">
                <ext-toolbar docked="top">
                    <ext-searchfield :placeholder="l10n(`Search links`)" width="200" @change="_search"/>

                    <ext-spacer/>

                    <ext-button iconCls="fa-solid fa-plus" :text="l10n(`Create link`)" @tap="_showCreateLinkDialog"/>

                    <ext-button iconCls="fa-solid fa-redo" :text="l10n(`Refresh`)" @tap="refresh"/>
                </ext-toolbar>

                <ext-column dataIndex="name" flex="1" :text="l10n(`Name`)"/>

                <ext-column dataIndex="created" renderer="Ext.util.Format.dateRenderer()" :text="l10n(`Creation date`)" width="120"/>

                <ext-column align="right" dataIndex="total_subscribed_users_text" sorter='{"property":"total_subscribed_users"}' :text="l10n(`Subscribed users`)" width="170"/>

                <ext-column dataIndex="last_user_created" renderer="Ext.util.Format.dateRenderer()" :text="l10n(`Last user created`)" width="120"/>

                <ext-column width="150" @ready="_actionColReady"/>
            </ext-grid>

            <ext-panel collapsed="false" collapsible="right" docked="right" headerPosition="left" layout="fit" minWidth="400" resizable='{"edges":"west","snap":200,"split":true}' :title="l10n(`Bot link details`)" width="400" @ready="ready">
                <DetailsPanel :telegramBotId="telegramBotId" :telegramBotLinkId="telegramBotLinkId"/>
            </ext-panel>
        </template>
    </CardsPanel>
</template>

<script>
import CardsPanel from "#src/components/cards.panel";
import TelegramBotLinkModel from "./models/link";
import CreateLinkDialog from "./create.dialog";
import DetailsPanel from "./details.panel";

export default {
    "components": { CardsPanel, DetailsPanel },

    "props": {
        "telegramBotId": {
            "type": String,
            "required": true,
        },
    },

    // XXX
    data () {
        return {
            "canUpdate": this.$app.user.hasPermissions( "administration:update" ),
            "canDelete": this.$app.user.hasPermissions( "administration:delete" ),
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

            this.$utils.copyToClipboard( record.get( "url" ) );

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
    },
};
</script>

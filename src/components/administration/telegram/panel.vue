<template>
    <CardsPanel ref="cards" :store="store" @refresh="refresh">
        <template #docked>
            <ext-toolbar docked="top">
                <ext-searchfield :placeholder="l10n(`Search bots`)" width="200" @change="_search"/>
                <ext-spacer/>
                <ext-button iconCls="fa-solid fa-redo" :text="l10n(`Refresh`)" @tap="refresh"/>
            </ext-toolbar>
        </template>

        <template #dataPanel>
            <ext-grid itemConfig='{"viewModel":true}' layout="fit" multicolumnSort="true" plugins='["gridviewoptions", "autopaging"]' :store="store">
                <ext-column width="50" @ready="_avatarColReady"/>

                <ext-column dataIndex="telegram_username" :text="l10n(`Name`)" width="200"/>

                <ext-column align="right" dataIndex="total_subscribed_users_text" sorter='{"property":"total_subscribed_users"}' :text="l10n(`Subscribed users`)" width="150"/>

                <ext-column align="right" dataIndex="total_unsubscribed_users_text" sorter='{"property":"total_unsubscribed_users"}' :text="l10n(`Unsubscribed users`)" width="150"/>

                <ext-column dataIndex="status_text" flex="1" sorter='{"property":"started"}' :text="l10n(`Status`)"/>

                <ext-column width="160" @ready="_actionColReady"/>
            </ext-grid>
        </template>
    </CardsPanel>
</template>

<script>
import CardsPanel from "#src/components/cards.panel";
import TelegramBotModel from "#src/components/telegram/bot/models/bot";
import AclDialog from "#vue/components/acl/dialog";

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
                    "read": "administration/telegram/bots/get-bots-list",
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
                    "xtype": "container",
                    "layout": {
                        "type": "hbox",
                        "pack": "end",
                    },
                    "items": [
                        {
                            "xtype": "avatar",
                            "bind": "{record.avatar_url}",
                        },
                    ],
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
                            "iconCls": "fa-regular fa-circle-play",
                            "text": this.l10n( "Start" ),
                            "handler": this._startBot.bind( this ),
                            "bind": { "hidden": "{record.started}" },
                            "disabled": !this.canUpdate,
                            "ui": "decline",
                        },
                        {
                            "xtype": "button",
                            "iconCls": "fa-regular fa-circle-stop",
                            "text": this.l10n( "Stop" ),
                            "handler": this._stopBot.bind( this ),
                            "bind": { "hidden": "{!record.started}" },
                            "disabled": !this.canUpdate,
                        },
                        {
                            "xtype": "button",
                            "iconCls": "fa-solid fa-unlock-alt",
                            "tooltip": this.l10n( "Users & permissions" ),
                            "handler": this._showAclDialog.bind( this ),
                        },
                        {
                            "xtype": "button",
                            "iconCls": "fa-solid fa-ellipsis-v",
                            "arrow": false,
                            "menu": {
                                "defaults": {
                                    "xtype": "menuitem",
                                },
                                "items": [
                                    {
                                        "iconCls": "fa-solid fa-trash-alt",
                                        "text": this.l10n( "Delete bot" ),
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
                    "property": "name",
                    "operator": "like",
                    "value": val,
                } );
            }
            else {
                this.store.removeFilter( "name" );
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
                this.$toast( res );
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
                this.$toast( res );
            }
        },

        async _deleteBot ( button ) {
            if ( !( await this.$utils.confirm( this.l10n( "Are you sure you want to delete this bot and all it's data? This operation is not revertable." ) ) ) ) return;

            const record = button.up( "gridrow" ).getRecord();

            button.disable();

            const res = await this.$api.call( "administration/telegram/bots/delete-bot", record.id );

            button.enable();

            if ( res.ok ) {
                this.refresh();
            }
            else {
                this.$toast( res );
            }
        },

        async _showAclDialog ( button ) {
            const record = button.up( "gridrow" ).getRecord();

            const cmp = await this.$mount( AclDialog, {
                "props": {
                    "aclId": record.get( "acl_id" ),
                },
            } );

            cmp.ext.show();
        },
    },
};
</script>

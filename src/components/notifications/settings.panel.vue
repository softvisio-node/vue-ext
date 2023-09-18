<template>
    <ext-panel defaults='{"padding":"0 0 30 0"}' layout="vbox">
        <!-- push notifications -->
        <ext-container :hidden="pusHidden">
            <ext-container layout='{"align":"start","type":"hbox"}'>
                <ext-container layout="vbox" width="260">
                    <ext-container :html="l10n(`Push notifications`)" style="font-size: 1.3em"/>
                    <ext-container :html="l10n(`Receive push notifications on this device`)"/>
                </ext-container>
                <ext-container>
                    <PushNotificationsButton :hideLabel="true"/>
                </ext-container>
            </ext-container>
        </ext-container>

        <!-- telegram -->
        <ext-container :hidden="!telegramSupported">
            <ext-container layout='{"align":"start","type":"hbox"}'>
                <ext-container layout="vbox" width="260">
                    <ext-container html='<i class="fa-brands fa-telegram"></i> Telegram' style="font-size: 1.3em"/>
                    <ext-container :html="l10n(`To use Telegram support bot you need to link your Telegram account`)"/>
                </ext-container>
                <ext-container>
                    <!-- link -->
                    <ext-container :hidden="telegramLinked">
                        <ext-button :text="l10n(`Link Telegram`)" @tap="_linkTelegramBot"/>
                    </ext-container>

                    <!-- open -->
                    <ext-container :hidden="!telegramLinked" layout="vbox">
                        <ext-button :text="l10n(`Open Telegram bot`)" @tap="_openTelegramBot"/>
                        <ext-button iconCls="fa-regular fa-trash-can" :text="l10n(`Unlink Telegram`)" @tap="_unlinkTelegramBot"/>
                    </ext-container>
                </ext-container>
            </ext-container>
        </ext-container>

        <!-- notification types -->
        <CardsPanel ref="cardsPanel" flex="1" :hidden="notificationTypesHidden" @refresh="refresh">
            <template #dataPanel>
                <ext-grid columnMenu="false" columnResize="false" itemConfig='{"viewModel":true}' layout="fit" selectable="false" sortable="false" @ready="_gridReady">
                    <!-- type -->
                    <ext-column cell='{"encodeHtml":false}' dataIndex="title" :text="l10n(`Notifications`)" width="220"/>

                    <!-- internal -->
                    <ext-column align="center" :hidden="!internalNotificationsEnabled" text="Internal" width="110" @ready="_internalColReady"/>

                    <!-- email -->
                    <ext-column align="center" :hidden="!emailNotificationsEnabled" text="Email" width="110" @ready="_emailColReady"/>

                    <!-- telegram -->
                    <ext-column align="center" :hidden="!telegramNotificationsEnabled" text="Telegram" width="110" @ready="_telegramColReady"/>

                    <!-- push -->
                    <ext-column align="center" :hidden="!pushNotificationsEnabled" text="Push" width="110" @ready="_pushColReady"/>
                </ext-grid>
            </template>
        </CardsPanel>
    </ext-panel>
</template>

<script>
import PushNotificationsButton from "#src/components/push-notifications.button";
import CardsPanel from "#src/components/cards.panel";
import Model from "./models/notification-type";
import LinkTelegramDialig from "./link-telegram.dialig";

export default {
    "components": { PushNotificationsButton, CardsPanel },

    "props": {
        "aclId": {
            "type": String,
            "default": "",
        },
    },

    "emits": ["update"],

    data () {
        return {
            "notificationTypesHidden": false,
            "internalNotificationsEnabled": false,
            "emailNotificationsEnabled": false,
            "telegramNotificationsEnabled": false,
            "pushNotificationsEnabled": false,

            "telegramSupported": false,
            "telegramBotUrl": null,
            "linkedTelegramUsername": null,
        };
    },

    "computed": {
        pusHidden () {
            return !this.$app.notifications.pushNotificationsSupported;
        },

        telegramLinked () {
            return !!this.linkedTelegramUsername;
        },
    },

    created () {
        this.store = Ext.create( "Ext.data.Store", {
            "model": Model,
            "autoLoad": false,
            "pageSize": null,
            "remoteFilter": false,
            "filters": [
                {
                    "property": "editable",
                    "opertor": "=",
                    "value": true,
                },
            ],
        } );

        this._telegramLinkedListener = linkedTelegramUsername => {
            this.linkedTelegramUsername = linkedTelegramUsername;

            if ( linkedTelegramUsername ) {
                this.$toast( this.l10n( `Telegram linked` ) );
            }
            else {
                this.$toast( this.l10n( `Telegram unlinked` ) );
            }
        };

        this.$api.on( "notifications/telegram-linked", this._telegramLinkedListener );
    },

    unmounted () {
        this.$api.off( "notifications/telegram-linked", this._telegramLinkedListener );
    },

    "methods": {
        _gridReady ( e ) {
            const cmp = e.detail.cmp;

            cmp.setStore( this.store );
        },

        _internalColReady ( e ) {
            this._toggleColReady( "internal", e );
        },

        _emailColReady ( e ) {
            this._toggleColReady( "email", e );
        },

        _telegramColReady ( e ) {
            this._toggleColReady( "telegram", e );
        },

        _pushColReady ( e ) {
            this._toggleColReady( "push", e );
        },

        _toggleColReady ( channel, e ) {
            const cmp = e.detail.cmp;

            cmp.setCell( {
                "xtype": "widgetcell",
                "widget": {
                    "xtype": "container",
                    "layout": { "type": "hbox", "pack": "center" },
                    "items": [
                        {
                            "xtype": "togglefield",
                            "bind": {
                                "hidden": `{!record.channels.${channel}.enabled}`,
                                "disabled": `{!record.channels.${channel}.editable}`,
                                "value": `{record.channels.${channel}.subscribed}`,
                            },
                            "listeners": { "change": this.toggleChannelSubscribed.bind( this, channel ) },
                        },
                    ],
                },
            } );
        },

        async refresh () {
            this.$refs.cardsPanel.mask();

            const res = await this.$api.call( "account/notifications/get-user-notifications-profile", {
                "acl_id": this.aclId || null,
            } );

            this.$refs.cardsPanel.setResult( res );

            if ( res.ok ) {
                this.telegramSupported = res.data.telegramSupported;
                this.telegramBotUrl = res.data.telegramBotUrl;
                this.linkedTelegramUsername = res.data.linkedTelegramUsername;

                this.notificationTypesHidden = true;

                this.internalNotificationsEnabled = false;
                this.emailNotificationsEnabled = false;
                this.telegramNotificationsEnabled = false;
                this.pushNotificationsEnabled = false;

                if ( res.data.notifications ) {
                    this.store.loadRawData( res.data.notifications );

                    this.store.each( record => {
                        if ( !record.get( "editable" ) ) return;

                        const channels = record.get( "channels" );

                        // enable channels
                        for ( const channel of Object.keys( channels ) ) {
                            if ( channels[channel].editable ) {
                                this.notificationTypesHidden = false;

                                this[channel + "NotificationsEnabled"] = true;
                            }
                        }
                    } );
                }
            }
        },

        async toggleChannelSubscribed ( channel, button, newValue, oldValue ) {
            const record = button.up( "gridrow" ).getRecord(),
                typeChannel = record.get( "channels" )[channel],
                currentValue = typeChannel.subscribed;

            if ( newValue === currentValue ) return;

            button.disable();

            const res = await this.$api.call( "account/notifications/set-user-notification-subscribed", {
                "acl_id": this.aclId || null,
                "notification": record.id,
                channel,
                "subscribed": newValue,
            } );

            if ( !res.ok ) {
                await new Promise( resolve => setTimeout( resolve, 500 ) );
                button.setValue( currentValue );

                this.$toast( res );
            }
            else {
                button.setValue( newValue );

                typeChannel.subscribed = newValue;

                // re-calculate
                record.set( "subscribed", null );

                this.$emit( "update", record.id, channel, newValue );
            }

            button.enable();
        },

        _openTelegramBot () {
            this.$utils.clickUrl( this.telegramBotUrl );
        },

        async _linkTelegramBot () {
            const res = await this.$api.call( "account/notifications/get-telegram-link-url" );

            if ( !res.ok ) {
                this.$toast( res );
            }
            else {
                if ( res.data.linkedTelegramUsername ) {
                    this.linkedTelegramUsername = res.data.linkedTelegramUsername;
                }
                else {
                    const cmp = await this.$mount( LinkTelegramDialig, {
                        "props": {
                            "linkTelegramBotUrl": res.data.linkTelegramBotUrl,
                        },
                    } );

                    cmp.ext.show();
                }
            }
        },

        async _unlinkTelegramBot () {
            const res = await this.$api.call( "account/notifications/unlink-telegram" );

            if ( !res.ok ) {
                this.$toast( res );
            }
            else {
                this.linkedTelegramUsername = null;
            }
        },
    },
};
</script>

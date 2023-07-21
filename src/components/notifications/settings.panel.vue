<template>
    <ext-panel defaults='{"padding":"0 0 30 0"}' layout="vbox">
        <!-- push notifications -->
        <ext-container :hidden="pusHidden">
            <ext-container layout='{"align":"start","type":"hbox"}'>
                <ext-container layout="vbox" width="260">
                    <ext-container :html="i18nd(`vue-ext`, `Push notifications`)" style="font-size: 1.3em"/>
                    <ext-container :html="i18nd(`vue-ext`, `Receive push notifications on this device`)"/>
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
                    <ext-container :html="i18nd(`vue-ext`, `To use Telegram support bot you need to link your Telegram account`)"/>
                </ext-container>
                <ext-container>
                    <!-- link -->
                    <ext-container :hidden="telegramLinked">
                        <ext-button :text="i18nd(`vue-ext`, `Link Telegram`)" @tap="_linkTelegramBot"/>
                    </ext-container>

                    <!-- open -->
                    <ext-container :hidden="!telegramLinked" layout="vbox">
                        <ext-button :text="i18nd(`vue-ext`, `Open Telegram bot`)" @tap="_openTelegramBot"/>
                        <ext-button iconCls="fa-regular fa-trash-can" :text="i18nd(`vue-ext`, `Unlink Telegram`)" @tap="_unlinkTelegramBot"/>
                    </ext-container>
                </ext-container>
            </ext-container>
        </ext-container>

        <!-- notification types -->
        <CardsPanel ref="cardsPanel" flex="1" :hidden="notificationTypesHidden" @refresh="refresh">
            <template #data>
                <ext-grid columnMenu="false" columnResize="false" itemConfig='{"viewModel":true}' layout="fit" selectable="false" sortable="false" @ready="_gridReady">
                    <!-- type -->
                    <ext-column cell='{"encodeHtml":false}' dataIndex="title" :text="i18nd(`vue-ext`, `Notification types`)" width="220"/>

                    <!-- internal -->
                    <ext-column align="center" :hidden="!internalNotificationsEnabled" :text="`<div style=&quot;text-align:center&quot;><b>` + i18nd(`vue-ext`, msgid`Internal${`</b><br/>`}notifications`) + '</div>'" width="110" @ready="_internalColReady"/>

                    <!-- email -->
                    <ext-column align="center" :hidden="!emailNotificationsEnabled" :text="`<div style=&quot;text-align:center&quot;><b>` + i18nd(`vue-ext`, msgid`Email${`</b><br/>`}notifications`) + '</div>'" width="110" @ready="_emailColReady"/>

                    <!-- telegram -->
                    <ext-column align="center" :hidden="!telegramNotificationsEnabled" :text="`<div style=&quot;text-align:center&quot;><b>` + i18nd(`vue-ext`, msgid`Telegram${`</b><br/>`}notifications`) + '</div>'" width="110" @ready="_telegramColReady"/>

                    <!-- push -->
                    <ext-column align="center" :hidden="!pushNotificationsEnabled" :text="`<div style=&quot;text-align:center&quot;><b>` + i18nd(`vue-ext`, msgid`Push${`</b><br/>`}notifications`) + '</div>'" width="110" @ready="_pushColReady"/>
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
                this.$utils.toast( this.i18nd( `vue-ext`, `Telegram linked` ) );
            }
            else {
                this.$utils.toast( this.i18nd( `vue-ext`, `Telegram unlinked` ) );
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

            const res = await this.$api.call( "account/notifications/get-user-notifications-profile" );

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
                "notification": record.id,
                channel,
                "subscribed": newValue,
            } );

            if ( !res.ok ) {
                await new Promise( resolve => setTimeout( resolve, 500 ) );
                button.setValue( currentValue );

                this.$utils.toast( res );
            }
            else {
                typeChannel.subscribed = newValue;
            }

            button.enable();
        },

        _openTelegramBot () {
            this.$utils.clickUrl( this.telegramBotUrl );
        },

        async _linkTelegramBot () {
            const res = await this.$api.call( "account/notifications/get-telegram-link-url" );

            if ( !res.ok ) {
                this.$utils.toast( res );
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
                this.$utils.toast( res );
            }
            else {
                this.linkedTelegramUsername = null;
            }
        },
    },
};
</script>

<style>
.notification-type-name {
    font-weight: bold;
    font-size: 1.2em;
}
</style>

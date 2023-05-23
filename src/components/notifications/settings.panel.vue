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
                        <ext-button :text="i18nd(`vue-ext`, `Link telegram`)" @tap="_linkTelegramBot"/>
                    </ext-container>

                    <!-- open -->
                    <ext-container :hidden="!telegramLinked" layout="vbox">
                        <ext-button :text="i18nd(`vue-ext`, `Open telegram bot`)" @tap="_openTelegramBot"/>
                        <ext-button iconCls="fa-regular fa-trash-can" :text="i18nd(`vue-ext`, `Unlink telegram`)" @tap="_unlinkTelegramBot"/>
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
            "telegramUrl": null,
            "telegramLinked": false,
        };
    },

    "computed": {
        pusHidden () {
            return !this.$app.notifications.pushNotificationsSupported;
        },
    },

    created () {
        this.store = Ext.create( "Ext.data.Store", {
            "model": Model,
            "autoLoad": false,
            "pageSize": null,
        } );
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
                                "value": `{record.${channel}}`,
                                "disabled": `{!record.${channel}_enabled}`,
                            },
                            "listeners": { "change": this.toggleChannelEnabled.bind( this, channel ) },
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
                if ( !res.data.types ) {
                    this.notificationTypesHidden = true;
                }
                else {
                    this.notificationTypesHidden = false;

                    this.internalNotificationsEnabled = res.data.internalNotificationsEnabled;
                    this.emailNotificationsEnabled = res.data.emailNotificationsEnabled;
                    this.telegramNotificationsEnabled = res.data.telegramNotificationsEnabled;
                    this.pushNotificationsEnabled = res.data.pushNotificationsEnabled;

                    this.telegramSupported = res.data.telegramSupported;
                    this.telegramUrl = res.data.telegramUrl;
                    this.telegramLinked = res.data.telegramLinked;

                    this.store.loadRawData( res.data.types );
                }
            }
        },

        async toggleChannelEnabled ( channel, button, newVal, oldVal ) {
            const record = button.up( "gridrow" ).getRecord(),
                curVal = record.get( channel );

            if ( newVal === curVal ) return;

            button.disable();

            const res = await this.$api.call( "account/notifications/set-user-notification-channel-enabled", record.get( "type" ), channel, newVal );

            button.enable();

            if ( !res.ok ) {
                button.reject();

                this.$utils.toast( res );
            }
            else {
                record.commit();
            }

            return;
        },

        _openTelegramBot () {

            // window.open( this.telegramUrl, "_blank" ).focus();
            this.$utils.clickUrl( this.telegramUrl );
        },

        // XXX watch link
        async _linkTelegramBot () {
            const res = await this.$api.call( "account/notifications/get-telegram-link-url" );

            if ( !res.ok ) {
                this.$utils.toast( res );
            }
            else {

                // window.open( res.data, "_blank" ).focus();
                this.$utils.clickUrl( res.data.localUrl );

                // XXX
                this.telegramLinked = true;
            }
        },

        async _unlinkTelegramBot () {
            const res = await this.$api.call( "account/notifications/unlink-telegram" );

            if ( !res.ok ) {
                this.$utils.toast( res );
            }
            else {
                this.telegramLinked = false;
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

.notification-type-description {
    font-size: 1em;
}
</style>

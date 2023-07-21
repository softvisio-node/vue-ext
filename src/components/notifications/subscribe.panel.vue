<template>
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
</template>

<script>
import CardsPanel from "#src/components/cards.panel";
import Model from "./models/notification-type";

export default {
    "components": { CardsPanel },

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
                                "value": `{record.channels.${channel}.active}`,
                            },
                            "listeners": { "change": this.toggleChannelActive.bind( this, channel ) },
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
                if ( !res.data.notifications ) {
                    this.notificationTypesHidden = true;
                }
                else {
                    this.notificationTypesHidden = false;

                    this.internalNotificationsEnabled = res.data.internalNotificationsEnabled;
                    this.emailNotificationsEnabled = res.data.emailNotificationsEnabled;
                    this.telegramNotificationsEnabled = res.data.telegramNotificationsEnabled;
                    this.pushNotificationsEnabled = res.data.pushNotificationsEnabled;

                    this.telegramSupported = res.data.telegramSupported;
                    this.telegramBotUrl = res.data.telegramBotUrl;
                    this.linkedTelegramUsername = res.data.linkedTelegramUsername;

                    this.store.loadRawData( res.data.notifications );
                }
            }
        },

        async toggleChannelActive ( channel, button, newValue, oldValue ) {
            const record = button.up( "gridrow" ).getRecord(),
                typeChannel = record.get( "channels" )[channel],
                currentValue = typeChannel.active;

            if ( newValue === currentValue ) return;

            button.disable();

            const res = await this.$api.call( "account/notifications/set-user-notification-active", {
                "notification": record.id,
                channel,
                "active": newValue,
            } );

            if ( !res.ok ) {
                await new Promise( resolve => setTimeout( resolve, 500 ) );
                button.setValue( currentValue );

                this.$utils.toast( res );
            }
            else {
                typeChannel.active = newValue;
            }

            button.enable();
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
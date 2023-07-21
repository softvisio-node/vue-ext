<template>
    <CardsPanel ref="cardsPanel" flex="1" :hidden="notificationTypesHidden" @refresh="refresh">
        <template #data>
            <ext-grid columnMenu="false" columnResize="false" itemConfig='{"viewModel":true}' layout="fit" selectable="false" sortable="false" @ready="_gridReady">
                <ext-column cell='{"encodeHtml":false}' dataIndex="title" flex="1" :text="i18nd(`vue-ext`, `Notification`)"/>

                <ext-column align="center" :text="i18nd(`vue-ext`, `Subscribed`)" width="110" @ready="_subscribedColReady"/>
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

        _subscribedColReady ( e ) {
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
                                "hidden": `{!record.enabled}`,
                                "disabled": `{!record.editable}`,
                                "value": `{record.active}`,
                            },
                            "listeners": { "change": this.toggleActive.bind( this ) },
                        },
                    ],
                },
            } );
        },

        // XXX
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

        // XXX aclId
        async toggleActive ( button, newValue, oldValue ) {
            const record = button.up( "gridrow" ).getRecord(),
                currentValue = record.get( "active" );

            if ( newValue === currentValue ) return;

            button.disable();

            const res = await this.$api.call( "account/notifications/set-user-notification-active", {

                // "aclId": this.aclId, // XXX
                "notification": record.id,
                "active": newValue,
            } );

            if ( !res.ok ) {
                await new Promise( resolve => setTimeout( resolve, 500 ) );

                button.setValue( currentValue );

                this.$utils.toast( res );
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

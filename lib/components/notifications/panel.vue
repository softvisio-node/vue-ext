<template>
    <ext-panel defaults='{"padding":"0 0 30 0"}' layout="vbox" @ready="_ready">
        <!-- push notifications -->
        <ext-panel :hidden="pusHidden">
            <ext-toolbar docked="top">
                <ext-container :html="i18nd(`vue-ext`, `Push notifications`)"/>
            </ext-toolbar>

            <ext-container layout="hbox">
                <ext-container flex="1" :html="i18nd(`vue-ext`, `Receive push notifications on this device`)"/>
                <PushNotificationsButton :hideLabel="true"/>
            </ext-container>
        </ext-panel>

        <!-- notification types -->
        <ext-grid columnMenu="false" columnResize="false" flex="1" itemConfig='{"viewModel":true}' sortable="false" @ready="_gridReady">
            <ext-toolbar docked="top">
                <ext-container :html="i18nd(`vue-ext`, `Notification types`)"/>
            </ext-toolbar>
            <ext-column cell='{"encodeHtml":false}' dataIndex="title" flex="1"/>
            <ext-column align="center" :text="`<div style=&quot;text-align:center&quot;><b>` + i18nd(`vue-ext`, msgid`Internal${`</b><br/>`}notifications`) + '</div>'" width="110" @ready="_internalColReady"/>
            <ext-column align="center" :text="`<div style=&quot;text-align:center&quot;><b>` + i18nd(`vue-ext`, msgid`Email${`</b><br/>`}notifications`) + '</div>'" width="110" @ready="_emailColReady"/>
            <ext-column align="center" :text="`<div style=&quot;text-align:center&quot;><b>` + i18nd(`vue-ext`, msgid`Telegram${`</b><br/>`}notifications`) + '</div>'" width="110" @ready="_telegramColReady"/>
            <ext-column align="center" :text="`<div style=&quot;text-align:center&quot;><b>` + i18nd(`vue-ext`, msgid`Push${`</b><br/>`}notifications`) + '</div>'" width="110" @ready="_pushColReady"/>
        </ext-grid>
    </ext-panel>
</template>

<script>
import PushNotificationsButton from "#lib/components/push-notifications.button";

export default {
    "components": { PushNotificationsButton },

    "computed": {
        pusHidden () {
            return !this.$store.session.pushNotificationsSupported;
        },
    },

    "methods": {
        _ready ( e ) {
            this.reload();
        },

        _gridReady ( e ) {
            const cmp = e.detail.cmp;

            cmp.setStore( this.$store.notifications.settingsStore );
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

        async reload () {
            await this.$store.notifications.reloadSettings();
        },

        async toggleChannelEnabled ( channel, button, newVal, oldVal ) {
            const record = button.up( "gridrow" ).getRecord(),
                curVal = record.get( channel );

            if ( newVal === curVal ) return;

            button.disable();

            const res = await this.$api.call( "account/notifications/set-user-notification-channel", record.get( "type" ), channel, newVal );

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

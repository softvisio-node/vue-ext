<template>
    <ext-panel layout="vbox" @ready="_ready">
        <!-- <ext-container layout="hbox"> -->
        <!--     <ext-textfield :label="i18n(`Yout Email Address`)" labelAlign="left" labelWidth="150" :value="email"/> -->
        <!--     <ext-button :text="i18n(`Update`)"/> -->
        <!-- </ext-container> -->

        <ext-container layout="hbox" :hidden="!telegramEnabled">
            <ext-textfield ref="telegramUsernameField" :label="i18n(`Your Telegram username`)" labelAlign="left" labelWidth="150" :value="telegramUsername"/>
            <ext-button :text="i18n(`Update`)" @tap="_updateTelegramUsername"/>
            <ext-button :text="i18n(msgid`Open @${telegramBotUsername}`)" iconCls="fa-solid fa-external-link-alt" iconAlign="right" @tap="_openTelegramBot"/>
        </ext-container>

        <ext-container :hidden="!telegramEnabled">
            <div>{{ i18n(msgid`In order to receive telegram notifications you need to set your telegram username. Then open chat with the <b>@${telegramBotUsername}</b> and press <b>"Start"</b>.`) }}</div>
        </ext-container>

        <ext-grid flex="1" itemConfig='{"viewModel":true}' sortable="false" columnMenu="false" columnResize="false" @ready="_gridReady">
            <ext-toolbar docked="top">
                <ext-container :html="i18n(`Notification types`)"/>
            </ext-toolbar>
            <ext-column dataIndex="title" flex="1" cell='{"encodeHtml":false}'/>
            <ext-column :text="`<div style=&quot;text-align:center&quot;><b>` + i18n(msgid`Internal${`</b><br/>`}notifications`) + '</div>'" width="100" align="center" @ready="_internalColReady"/>
            <ext-column :text="`<div style=&quot;text-align:center&quot;><b>` + i18n(msgid`Email${`</b><br/>`}notifications`) + '</div>'" width="100" align="center" @ready="_emailColReady"/>
            <ext-column :text="`<div style=&quot;text-align:center&quot;><b>` + i18n(msgid`Telegram${`</b><br/>`}notifications`) + '</div>'" width="100" align="center" @ready="_telegramColReady"/>
            <ext-column :text="`<div style=&quot;text-align:center&quot;><b>` + i18n(msgid`Push${`</b><br/>`}notifications`) + '</div>'" width="100" align="center" @ready="_pushColReady"/>
        </ext-grid>
    </ext-panel>
</template>

<script>
export default {
    "computed": {
        email () {
            return this.$store.notifications.email;
        },

        telegramUsername () {
            return this.$store.notifications.telegramUsername;
        },

        telegramEnabled () {
            return !!this.$store.notifications.telegramBotUsername;
        },

        telegramBotUsername () {
            return this.$store.notifications.telegramBotUsername;
        },

        telegramBotUrl () {
            return "https://t.me/" + this.$store.notifications.telegramBotUsername;
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

        // XXX
        async reload () {
            await this.$store.notifications.reloadSettings();
        },

        async toggleChannelEnabled ( channel, button, newVal, oldVal ) {
            const record = button.up( "gridrow" ).getRecord(),
                curVal = record.get( channel );

            if ( newVal === curVal ) return;

            button.disable();

            var res = await this.$api.call( "notifications/set-user-notification-channel", record.get( "type" ), channel, newVal );

            if ( !res.ok ) {
                this.$utils.toast( res );

                await this.$utils.sleep( 1000 );

                button.suspendEvent( "change" );
                record.set( channel, oldVal );
                button.enable();
                button.resumeEvent( "change" );
            }
            else {
                button.enable();
            }

            return;
        },

        _openTelegramBot () {
            window.open( this.telegramBotUrl, "_blank" ).focus();
        },

        async _updateTelegramUsername ( e ) {
            const button = e.detail.sender,
                field = this.$refs.telegramUsernameField.ext,
                value = field.getValue();

            button.disable();

            const res = await this.$api.call( "profile/set-telegram-username", value );

            button.enable();

            if ( !res.ok ) {
                this.$utils.toast( res );
            }
            else {
                this.$store.notifications.telegramUsername = value;

                this.$utils.toast( this.i18n( `Telegram username updated` ) );
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

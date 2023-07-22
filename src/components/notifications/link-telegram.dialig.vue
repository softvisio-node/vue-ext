<template>
    <ext-dialog height="400" layout='{"align":"center","pack":"start","type":"vbox"}' :title="l10nd(`vue-ext`, `Link Telegram`)" width="350">
        <ext-container :html='l10nd(`vue-ext`, `If you have Telegram installed on <b>THIS</b> device, then press button below to open Telegram bot and then click "Start":`)' padding="0 0 10 0"/>

        <ext-button :text="l10nd(`vue-ext`, `Link Telegram`)" ui="action" @tap="_openTelegramBot"/>

        <ext-container :html="l10nd(`vue-ext`, `Or if you have Telegram installed on the <b>OTHER</b> device, then copy link url and open it on device there your Telegram is installed:`)" padding="50 0 10 0"/>

        <ext-button iconCls="fa-solid fa-copy" :text="l10nd(`vue-ext`, `Copy link`)" ui="action" @tap="_copyTelegramLink"/>
    </ext-dialog>
</template>

<script>
import Events from "#core/events";

export default {
    "props": {
        "linkTelegramBotUrl": {
            "type": String,
            "required": true,
        },
    },

    created () {
        this._events = new Events().link( this.$api ).on( "notifications/telegram-linked", () => this.ext.close() );
    },

    unmounted () {
        this._events.clear();
    },

    "methods": {
        _openTelegramBot () {
            this.$utils.clickUrl( this.linkTelegramBotUrl );
        },

        _copyTelegramLink () {
            this.$utils.copyToClipboard( this.linkTelegramBotUrl );

            this.$utils.toast( this.l10nd( `vue-ext`, "Telegram link copied to the clipboard" ) );
        },
    },
};
</script>

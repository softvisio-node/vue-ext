<template>
    <ext-dialog height="400" layout='{"align":"center","pack":"start","type":"vbox"}' :title="i18nd(`vue-ext`, `Link Telegram`)" width="350">
        <ext-container :html='i18nd(`vue-ext`, `If you have Telegram installed on <b>THIS</b> device, then press button below to open Telegram bot and then click "Start":`)' padding="0 0 10 0"/>

        <ext-button :text="i18nd(`vue-ext`, `Link Telegram`)" ui="action" @tap="_openTelegramBot"/>

        <ext-container :html="i18nd(`vue-ext`, `Or if you have Telegram installed on the <b>OTHER</b> device, then copy link url and open it on device there your Telegram is installed:`)" padding="50 0 10 0"/>

        <ext-button iconCls="fa-solid fa-copy" :text="i18nd(`vue-ext`, `Copy link`)" ui="action" @tap="_copyTelegramLink"/>
    </ext-dialog>
</template>

<script>
import Events from "#core/events";

export default {
    "props": {
        "localUrl": {
            "type": String,
            "required": true,
        },
        "remoteUrl": {
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

            // window.open( res.data, "_blank" ).focus();
            this.$utils.clickUrl( this.localUrl );
        },

        _copyTelegramLink () {
            this.$utils.copyToClipboard( this.remoteUrl );

            this.$utils.toast( this.i18nd( `vue-ext`, "Telegram link copied to the clipboard" ) );
        },
    },
};
</script>

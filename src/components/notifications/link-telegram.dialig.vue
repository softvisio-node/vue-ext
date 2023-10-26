<template>
    <ext-dialog height="400" layout='{"align":"center","pack":"start","type":"vbox"}' :title="l10n(`Link Telegram`)" width="300">
        <ext-container :html='l10n(`If you have Telegram installed on <b>THIS</b> device, then press button below to open Telegram bot and then click "Start":`)'/>

        <ext-button :text="l10n(`Link Telegram`)" ui="action" @tap="_openTelegramBot"/>

        <ext-container height="30"/>

        <ext-container :html="l10n(`Or if you have Telegram installed on the <b>OTHER</b> device, then copy link url and open it on device there your Telegram is installed:`)"/>

        <ext-button iconCls="fa-solid fa-copy" :text="l10n(`Copy link`)" ui="action" @tap="_copyTelegramLink"/>
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
        this._events = new Events().link( this.$api ).on( "notifications/telegram/update", linkedTelegramUsername => {
            if ( linkedTelegramUsername ) this.ext.close();
        } );
    },

    unmounted () {
        this._events.clear();
        this._events = null;
    },

    "methods": {
        _openTelegramBot () {
            this.$utils.clickUrl( this.linkTelegramBotUrl );
        },

        _copyTelegramLink () {
            this.$utils.copyToClipboard( this.linkTelegramBotUrl );

            this.$toast( this.l10n( "Telegram link copied to the clipboard" ) );
        },
    },
};
</script>

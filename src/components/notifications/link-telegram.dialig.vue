<template>
    <ext-dialog height="400" layout='{"align":"center","pack":"start","type":"vbox"}' :title="i18nd(`vue-ext`, `Link Telegram`)" width="350">
        <ext-container :html='i18nd(`vue-ext`, `If you have Telegram installed on <b>THIS</b> device press button below and click "in Staty" Telegram window.`)' padding="0 0 10 0"/>

        <ext-button :text="i18nd(`vue-ext`, `Link Telegram`)" ui="action" @tap="_openTelegramBot"/>

        <ext-container :html="i18nd(`vue-ext`, `If you have Telegram installed on <b>OTHER</b> device - copy link url and open it on device there your Telegram is installed..`)" padding="50 0 10 0"/>

        <ext-button iconCls="fa-solid fa-copy" :text="i18nd(`vue-ext`, `Copy link`)" ui="action" @tap="_copyTelegramLink"/>
    </ext-dialog>
</template>

<script>
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

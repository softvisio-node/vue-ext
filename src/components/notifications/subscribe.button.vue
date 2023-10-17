<template>
    <ext-container :hidden="hidden" @ready="_ready">
        <ext-button ref="button" iconCls="fa-regular fa-eye" :text="l10n(`Watch`)" :ui="ui" @tap="showNotificationsSubscribeDialog"/>

        <NotificationsSubscribeDialog ref="dialog" :aclId="aclId"/>
    </ext-container>
</template>

<script>
import NotificationsSubscribeDialog from "#src/components/notifications/subscribe.dialog";

export default {
    "components": { NotificationsSubscribeDialog },

    "props": {
        "aclId": {
            "type": String,
            "default": "",
        },
        "hidden": {
            "type": Boolean,
            "default": false,
        },
        "ui": {
            "type": String,
            "default": "",
        },
    },

    "methods": {
        _ready ( e ) {
            this.ext = e.detail.cmp;
        },

        showNotificationsSubscribeDialog () {
            const dialog = this.$refs.dialog.ext;

            // XXX fix for case, when .showBy() coordinates are incorrect on first show
            if ( !this._initialized ) {
                this._initialized = true;

                dialog.showBy( this.ext, "tr-br" );
                if ( dialog.activeAnimation ) dialog.activeAnimation.stop();
                dialog.hide( false );
            }

            dialog.showBy( this.ext, "tr-br" );
        },
    },
};
</script>

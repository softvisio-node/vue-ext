<template>
    <ext-container :hidden="_hidden" @ready="_ready">
        <ext-button ref="button" iconCls="fa-regular fa-eye" :text="i18nd(`vue-ext`, `Watch`)" :ui="ui" @tap="showNotificationsDialog"/>

        <NotificationsDialog ref="dialog"/>
    </ext-container>
</template>

<script>
import NotificationsDialog from "#src/components/notifications/dialog";

export default {
    "components": { NotificationsDialog },

    "props": {
        "hidden": {
            "type": Boolean,
            "default": false,
        },
        "ui": {
            "type": String,
            "default": "",
        },
    },

    "computed": {
        totalInbox () {
            return this.$app.notifications.totalInbox;
        },

        _hidden () {
            return !this.$app.notifications.internalNotificationsEnabled || this.hidden;
        },
    },

    "watch": {
        "totalInbox": "_setNotificationsBadgeText",
    },

    "methods": {
        _ready ( e ) {
            this.ext = e.detail.cmp;

            this._setNotificationsBadgeText();
        },

        showNotificationsDialog () {
            const dialog = this.$refs.dialog.ext;

            // XXX fix for case, when .showBy() coordinates are incorrect on first show
            if ( !this._initialized ) {
                this._initialized = true;

                dialog.showBy( this.ext, "tr-br" );
                if ( dialog.activeAnimation ) dialog.activeAnimation.stop();
                dialog.hide( false );
            }

            dialog.showBy( this.ext, "tr-tl" );

            this.$app.notifications.refreshRelativeTime();
        },

        _setNotificationsBadgeText () {
            this.$refs.button.ext.setBadgeText( this.$app.notifications.totalInbox || "" );
        },
    },
};
</script>

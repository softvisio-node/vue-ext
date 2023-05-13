<template>
    <ext-container :hidden="hidden" @ready="_ready">
        <ext-button ref="button" iconCls="fa-regular fa-bell" margin="10 20 0 0" ui="action" width="55" @tap="showNotificationsDialog"/>

        <NotificationsDialog ref="dialog"/>
    </ext-container>
</template>

<script>
import NotificationsDialog from "#src/components/notifications/dialog";
import notificationsStore from "#src/components/notifications/store";

export default {
    "components": { NotificationsDialog },

    "props": {
        "hidden": {
            "type": Boolean,
            "default": false,
        },
    },

    "computed": {
        totalUndoneUnread () {
            return notificationsStore.totalUndoneUnread;
        },
    },

    "watch": {
        "totalUndoneUnread": "_setNotificationsBadgeText",
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

            notificationsStore.refreshRelativeTime();
        },

        _setNotificationsBadgeText () {
            this.$refs.button.ext.setBadgeText( notificationsStore.totalUndoneUnread || "" );
        },
    },
};
</script>

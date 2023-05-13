<template>
    <ext-container :hidden="hidden" @ready="_ready">
        <ext-button ref="button" iconCls="fa-regular fa-bell" margin="10 20 0 0" ui="action" width="55" @tap="toggleNotificationsDialog"/>

        <NotificationsDialog ref="dialog"/>
    </ext-container>
</template>

<script>
import NotificationsDialog from "./dialog";
import notificationsStore from "#vue/stores/notifications";

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

        toggleNotificationsDialog () {
            this.$refs.dialog.ext.showBy( this.ext, "tr-br" );
        },

        _setNotificationsBadgeText () {

            // not ready
            // if ( !this.$refs.notificationsButton.ext ) return;

            this.$refs.button.ext.setBadgeText( notificationsStore.totalUndoneUnread || "" );
        },
    },
};
</script>

<template>
    <ext-titlebar docked="top" padding="0 0 0 10" :title="title" titleAlign="left" @ready="ready">
        <slot name="logo"/>

        <!-- XXX this div is required to align components in slot after title -->
        <div/>

        <slot name="title"/>

        <ext-button ref="notificationsButton" align="right" :hidden="!notificationsButtonEnabled" iconCls="fa-regular fa-bell" margin="10 20 0 0" padding="0 0 10 0" width="55" @tap="showNotifications"/>

        <AvatarUser align="right" height="40" :hidden="!avatarEnabled" width="40"/>

        <ext-button align="right" height="50" :hidden="!menuEnabled" iconCls="fa-solid fa-bars" margin="0 0 0 5" width="40" @tap="showMenu"/>

        <Notifications ref="notifications"/>

        <AppMenu ref="menu" :accountButtonEnabled="menuAccountButtonEnabled" :changePasswordButtonEnabled="menuChangePasswordButtonEnabled" :pushNotificationsButtonEnabled="menuPushNotificationsButtonEnabled" @showAccountDialog="showAccountDialog">
            <template #top>
                <slot name="menuTop"/>
            </template>

            <template #bottom>
                <slot name="menuBottom"/>
            </template>
        </AppMenu>
    </ext-titlebar>
</template>

<script>
import AvatarUser from "#lib/components/avatar/user";
import AppMenu from "./menu";
import Notifications from "#lib/components/notifications/menu-sheet";

export default {
    "components": { AvatarUser, AppMenu, Notifications },

    "props": {
        "notificationsButtonEnabled": {
            "type": Boolean,
            "default": true,
        },
        "canDeleteNotifications": {
            "type": Boolean,
            "default": false,
        },
        "avatarEnabled": {
            "type": Boolean,
            "default": true,
        },
        "menuEnabled": {
            "type": Boolean,
            "default": true,
        },
        "menuAccountButtonEnabled": {
            "type": Boolean,
            "default": true,
        },
        "menuChangePasswordButtonEnabled": {
            "type": Boolean,
            "default": false,
        },
        "menuPushNotificationsButtonEnabled": {
            "type": Boolean,
            "default": false,
        },
    },

    "emits": ["showAccountDialog"],

    "computed": {
        title () {
            return this.$store.session.title;
        },

        totalUndoneUnread () {
            return this.$store.notifications.totalUndoneUnread;
        },
    },

    "watch": {
        "totalUndoneUnread": "_setNotificationsBadgeText",
    },

    "methods": {
        ready ( e ) {
            this._setNotificationsBadgeText();
        },

        showMenu () {
            this.$refs.menu.show();
        },

        hideMenu () {
            this.$refs.menu.hide();
        },

        showNotifications () {
            this.$refs.notifications.show();
        },

        hideNotifications () {
            this.$refs.notifications.hide();
        },

        showAccountDialog () {
            this.hideMenu();

            this.$emit( "showAccountDialog" );
        },

        _setNotificationsBadgeText () {
            this.$refs.notificationsButton.ext.setBadgeText( this.$store.notifications.totalUndoneUnread || "" );
        },
    },
};
</script>

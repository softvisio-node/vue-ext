<template>
    <ext-titlebar docked="top" titleAlign="left" :title="title" padding="0 0 0 10" @ready="ready">
        <slot name="logo"/>

        <!-- XXX this div is required to align components in slot after title -->
        <div/>

        <slot name="title"/>

        <ext-button ref="notificationsButton" align="right" iconCls="fa-regular fa-bell" width="55" padding="0 0 10 0" margin="10 20 0 0" :hidden="!notificationsEnabled" @tap="showNotifications"/>

        <AppAvatar align="right" width="40" height="40" :hidden="!avatarEnabled"/>

        <ext-button align="right" iconCls="fa-solid fa-bars" width="40" height="50" margin="0 0 0 5" :hidden="!menuEnabled" @tap="showMenu"/>

        <Notifications ref="notifications"/>

        <AppMenu ref="menu" :apiTokens="apiTokensEnabled" :showAccount="accountEnabled" :changePassword="changePasswordEnabled" @showAccountDialog="showAccountDialog">
            <template #top>
                <slot name="menuTop"/>
            </template>

            <template #bottomUp>
                <slot name="menuBottomUp"/>
            </template>

            <template #bottomDown>
                <slot name="menuBottomDown"/>
            </template>
        </AppMenu>
    </ext-titlebar>
</template>

<script>
import AppAvatar from "./avatar";
import AppMenu from "./menu";
import Notifications from "#components/notifications/menu-sheet";

export default {
    "components": { AppAvatar, AppMenu, Notifications },

    "props": {
        "notificationsEnabled": {
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
        "apiTokensEnabled": {
            "type": Boolean,
            "default": true,
        },
        "accountEnabled": {
            "type": Boolean,
            "default": true,
        },
        "changePasswordEnabled": {
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

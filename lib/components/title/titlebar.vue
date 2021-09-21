<template>
    <ext-titlebar docked="top" titleAlign="left" :title="title" padding="0 0 0 10" @ready="ready">
        <slot name="logo"/>

        <!-- XXX this div is required to align components in slot after title -->
        <div/>

        <slot name="title"/>

        <ext-button ref="notificationsButton" align="right" iconCls="far fa-bell" width="55" padding="0 0 10 0" margin="10 20 0 0" :hidden="!notifications" @tap="showNotifications"/>

        <Avatar align="right" width="40" height="40"/>

        <ext-button align="right" iconCls="fas fa-bars" width="40" height="50" margin="0 0 0 5" @tap="showMenu"/>

        <Notifications ref="notifications"/>

        <Menu ref="menu" :apiTokens="apiTokens" :profile="profile" :changePassword="changePassword" @showProfileDialog="showProfileDialog">
            <template #top>
                <slot name="menuTop"/>
            </template>

            <template #bottomUp>
                <slot name="menuBottomUp"/>
            </template>

            <template #bottomDown>
                <slot name="menuBottomDown"/>
            </template>
        </Menu>
    </ext-titlebar>
</template>

<script>
import Avatar from "./avatar";
import Menu from "./menu";

// import NotificationsDialog from "./notifications";
import Notifications from "./notifications";

export default {
    "components": { Avatar, Menu, Notifications },

    "props": {
        "notifications": {
            "type": Boolean,
            "default": true,
        },
        "apiTokens": {
            "type": Boolean,
            "default": true,
        },
        "profile": {
            "type": Boolean,
            "default": true,
        },
        "changePassword": {
            "type": Boolean,
            "default": false,
        },
    },

    "emits": ["showProfileDialog"],

    "computed": {
        title () {
            return this.$store.session.title;
        },

        notificationsBadgeText () {
            return this.$store.notifications.unreadCount;
        },
    },

    "watch": {
        "notificationsBadgeText": "_setNotificationsBadgeText",
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

        showProfileDialog () {
            this.hideMenu();

            this.$emit( "showProfileDialog" );
        },

        _setNotificationsBadgeText () {
            this.$refs.notificationsButton.ext.setBadgeText( this.$store.notifications.unreadCount || "" );
        },
    },
};
</script>

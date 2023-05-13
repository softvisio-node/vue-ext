<template>
    <ext-titlebar docked="top" padding="0 0 0 10" :title="title" titleAlign="left">
        <slot name="logo"/>

        <!-- XXX this div is required to align components in slot after title -->
        <div/>

        <slot name="title"/>

        <!-- notifications button -->
        <NotificationsButton align="right" :hidden="!notificationsbuttonenabled"/>

        <!-- avatar -->
        <AvatarUser align="right" height="40" :hidden="!avatarEnabled" width="40"/>

        <!-- menu button -->
        <ext-button align="right" height="50" :hidden="!menuEnabled" iconCls="fa-solid fa-bars" margin="0 0 0 5" width="40" @tap="showMenu"/>

        <AppMenu ref="menu" :accountButtonEnabled="menuAccountButtonEnabled" :administrationButtonEnabled="menuAdministrationButtonEnabled" :changePasswordButtonEnabled="menuChangePasswordButtonEnabled" :pushNotificationsButtonEnabled="menuPushNotificationsButtonEnabled" @showAccountDialog="showAccountDialog">
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
import AvatarUser from "#src/components/avatar/user";
import AppMenu from "./menu";
import NotificationsButton from "#src/components/notifications/button";

export default {
    "components": { AvatarUser, AppMenu, NotificationsButton },

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
        "menuAdministrationButtonEnabled": {
            "type": Boolean,
            "default": false,
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
            return this.$app.session.title;
        },
    },

    "methods": {
        showMenu () {
            this.$refs.menu.show();
        },

        hideMenu () {
            this.$refs.menu.hide();
        },

        showAccountDialog () {
            this.hideMenu();

            this.$emit( "showAccountDialog" );
        },
    },
};
</script>

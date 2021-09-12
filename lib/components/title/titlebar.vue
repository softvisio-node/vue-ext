<template>
    <ext-titlebar docked="top" titleAlign="left" :title="title" padding="0 0 0 10">
        <slot name="logo"/>

        <!-- XXX this div is required to align components in slot after title -->
        <div/>

        <slot name="title"/>

        <ext-button ref="notificationsButton" align="right" iconCls="far fa-bell" width="55" padding="0 0 10 0" margin="10 20 0 0" :hidden="notifications !== 'true'" @tap="showNotificationsDialog"/>
        <Avatar align="right" width="40" height="40"/>
        <ext-button align="right" iconCls="fas fa-bars" width="40" height="50" margin="0 0 0 5" @tap="showMenu"/>

        <Menu ref="menu" :apiTokens="apiTokens" :profile="profile" @showProfileDialog="showProfileDialog">
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
import NotificationsDialog from "./notifications";

export default {
    "components": { Avatar, Menu },

    "props": {
        "notifications": {
            "type": String,
            "default": "false",
        },
        "apiTokens": {
            "type": String,
            "default": "true",
        },
        "profile": {
            "type": String,
            "default": "true",
        },
    },

    "emits": ["showProfileDialog"],

    "computed": {
        title () {
            return this.$store.session.title;
        },
    },

    "methods": {

        // XXX
        async showNotificationsDialog ( e ) {
            const cmp = await this.$mount( NotificationsDialog );

            cmp.ext.showBy( this.$refs.notificationsButton.ext, "tr-bc" );

            // cmp.ext.showAt( ...this.$refs.notificationsButton.ext.el.getXY() );
        },

        showMenu () {
            this.$refs.menu.show();
        },

        hideMenu () {
            this.$refs.menu.hide();
        },

        showProfileDialog () {
            this.hideMenu();

            this.$emit( "showProfileDialog" );
        },
    },
};
</script>

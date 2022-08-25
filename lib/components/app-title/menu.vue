<template>
    <ext-sheet layout="vbox" modal="true" side="right" width="300" @ready="ready">
        <ext-panel height="130" innerCls="x-tabbar" layout="vbox" padding="30 10 10 30">
            <Avatar height="60" width="60"/>
            <ext-container :html="username"/>
        </ext-panel>

        <ext-panel flex="1" layout="vbox" padding="10 10 10 30">
            <slot name="top"/>

            <ext-spacer/>

            <slot name="bottomUp"/>

            <ext-button :hidden="!accountEnabled" iconCls="fa-solid fa-user" :text="i18nd(`vue-ext`, `Your account`)" textAlign="left" @tap="showAccountDialog"/>
            <ext-button :hidden="!changePasswordEnabled" iconCls="fa-solid fa-asterisk" :text="i18nd(`vue-ext`, `Change password`)" textAlign="left" @tap="showChangePasswordDialog"/>

            <slot name="bottomDown"/>

            <LocaleButton :autoHide="true"/>

            <ext-button iconCls="fa-solid fa-sign-out-alt" :text="i18nd(`vue-ext`, `Sign out`)" textAlign="left" @tap="signout"/>

            <!-- push notifications button -->
            <PushNotificationsButton :hidden="!pushNotificationsEnabled" labelWidth="200"/>

            <!-- dark node button -->
            <DarkModeButton labelWidth="200"/>
        </ext-panel>
    </ext-sheet>
</template>

<script>
import Avatar from "./avatar";
import LocaleButton from "#lib/components/locale.button";
import ChangePasswordDialog from "#lib/components/change-password-dialog";
import DarkModeButton from "#lib/components/dark-mode.button";
import PushNotificationsButton from "#lib/components/push-notifications.button";

export default {
    "components": { Avatar, LocaleButton, PushNotificationsButton, DarkModeButton },

    "props": {
        "accountEnabled": {
            "type": Boolean,
            "default": true,
        },
        "changePasswordEnabled": {
            "type": Boolean,
            "default": false,
        },
        "pushNotificationsEnabled": {
            "type": Boolean,
            "default": false,
        },
    },

    "emits": ["showAccountDialog"],

    "computed": {
        username () {
            return '<div class="username">' + this.$store.session.username + "</div>";
        },
    },

    created () {

        // disable viewport gestures, menu can be opened only by button click
        Ext.Viewport.addedSwipeListener = true;
    },

    "methods": {
        ready ( e ) {
            this.ext = e.detail.cmp;
        },

        show () {
            this.ext.show();
        },

        hide () {
            this.ext.hide();
        },

        close () {
            this.ext.hide( false );
        },

        async showAccountDialog () {
            this.$emit( "showAccountDialog" );
        },

        async showChangePasswordDialog () {
            this.hide();

            const cmp = await this.$mount( ChangePasswordDialog );

            cmp.ext.show();
        },

        signout () {
            this.close();

            this.$app.signout();
        },
    },
};
</script>

<style>
.username {
    color: white;
    font-size: 1.3em;
    margin-top: 5px;
}
</style>

<template>
    <ext-sheet layout="vbox" modal="true" side="right" width="300" @ready="ready">
        <ext-panel height="130" innerCls="x-tabbar" layout="vbox" padding="30 10 10 30">
            <AvatarUser height="60" width="60"/>
            <ext-container :html="username" margin="5 0 0 0" style="font-size: 1.3em; color: white"/>
        </ext-panel>

        <ext-panel flex="1" layout="vbox" padding="10 10 10 30">
            <slot name="top"/>

            <ext-button :hidden="!accountButtonEnabled" iconCls="fa-solid fa-user-tie" :text="i18nd(`vue-ext`, `Your account`)" textAlign="left" @tap="showAccountDialog"/>
            <ext-button :hidden="!changePasswordButtonEnabled" iconCls="fa-solid fa-asterisk" :text="i18nd(`vue-ext`, `Change password`)" textAlign="left" @tap="showChangePasswordDialog"/>

            <slot name="bottom"/>

            <ext-spacer/>

            <LocaleButton :autoHide="true"/>

            <!-- push notifications button -->
            <PushNotificationsButton :hidden="!pushNotificationsButtonEnabled" labelWidth="200"/>

            <!-- dark node button -->
            <DarkModeButton labelWidth="200"/>

            <ext-container height="10"/>

            <ext-button iconCls="fa-solid fa-sign-out-alt" :text="i18nd(`vue-ext`, `Sign out`)" textAlign="left" @tap="signout"/>
        </ext-panel>

        <ext-container :html="version" margin="0 10 0 10" style="opacity: 0.7"/>
    </ext-sheet>
</template>

<script>
import AvatarUser from "#lib/components/avatar/user";
import LocaleButton from "#lib/components/locale.button";
import ChangePasswordDialog from "#lib/components/change-password-dialog";
import DarkModeButton from "#lib/components/dark-mode.button";
import PushNotificationsButton from "#lib/components/push-notifications.button";

export default {
    "components": { AvatarUser, LocaleButton, PushNotificationsButton, DarkModeButton },

    "props": {
        "accountButtonEnabled": {
            "type": Boolean,
            "default": true,
        },
        "changePasswordButtonEnabled": {
            "type": Boolean,
            "default": false,
        },
        "pushNotificationsButtonEnabled": {
            "type": Boolean,
            "default": false,
        },
    },

    "emits": ["showAccountDialog"],

    "computed": {
        username () {
            return this.$store.session.username;
        },

        version () {
            return `frontend: ${this.$store.session.frontendVersionText} / backend: ${this.$store.session.backendVersionText}`;
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

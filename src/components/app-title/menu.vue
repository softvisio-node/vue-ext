<template>
    <ext-sheet layout="vbox" modal="true" side="right" width="300" @ready="_onReady">
        <ext-panel height="110" innerCls="x-tabbar" layout="vbox" padding="10 10 10 30">
            <ext-container layout='{"align":"start","type":"hbox"}'>
                <AvatarUser height="60" width="60"/>
                <ext-spacer/>
                <ext-container :hidden="!isRoot" html="root" style="font-size: 1.3em; color: white"/>
            </ext-container>

            <ext-container :html="email" margin="5 0 0 0" style="font-size: 1.3em; color: white"/>
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

            <ext-button iconCls="fa-solid fa-circle-info" :text="i18nd(`vue-ext`, `About the project`)" textAlign="left" @tap="showAboutDialog"/>

            <ext-button iconCls="fa-solid fa-sign-out-alt" :text="i18nd(`vue-ext`, `Sign out`)" textAlign="left" @tap="signout"/>
        </ext-panel>
    </ext-sheet>
</template>

<script>
import AvatarUser from "#src/components/avatar/user";
import LocaleButton from "#src/components/locale.button";
import ChangePasswordDialog from "#src/components/change-password.dialog";
import DarkModeButton from "#src/components/dark-mode.button";
import PushNotificationsButton from "#src/components/push-notifications.button";
import AboutDialog from "#src/components/about.dialog";

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
        isRoot () {
            return this.$app.isRoot;
        },

        email () {
            return this.$app.user.email;
        },
    },

    created () {

        // disable viewport gestures, menu can be opened only by button click
        Ext.Viewport.addedSwipeListener = true;
    },

    "methods": {
        _onReady ( e ) {
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

        async showAboutDialog () {
            const cmp = await this.$mount( AboutDialog );

            cmp.ext.show();
        },
    },
};
</script>

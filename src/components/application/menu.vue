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

            <!-- account buttin -->
            <ext-button :hidden="!showAccountButton" iconCls="fa-solid fa-user-tie" :text="i18nd(`vue-ext`, `Your account`)" textAlign="left" @tap="showAccountDialog"/>

            <!-- change password button -->
            <ext-button :hidden="!changePasswordButtonEnabled" iconCls="fa-solid fa-asterisk" :text="i18nd(`vue-ext`, `Change password`)" textAlign="left" @tap="showChangePasswordDialog"/>

            <!-- administration button                 -->
            <ext-button :hidden="!showAdministrationButton" :text="i18nd(`vue-ext`, `Administration`)" textAlign="left" @tap="showAdministrationDialog"/>

            <!-- development button                 -->
            <ext-button :hidden="!showDevelopmentButton" :text="i18nd(`vue-ext`, `Development`)" textAlign="left" @tap="showDevelopmentDialog"/>

            <slot name="bottom"/>

            <ext-spacer/>

            <LocaleButton :autoHide="true"/>

            <!-- push notifications button -->
            <PushNotificationsButton :hidden="!pushNotificationsButtonEnabled" labelWidth="200"/>

            <!-- dark node button -->
            <DarkModeButton labelWidth="200"/>

            <ext-container height="10"/>

            <!-- aboit                 -->
            <ext-button :text="i18nd(`vue-ext`, `About the project`)" textAlign="left" @tap="showAboutDialog"/>

            <!-- sign out                 -->
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

    data () {
        return {
            "email": this.$app.user.email,

            "isRoot": this.$app.user.isRoot,
        };
    },

    "computed": {
        showAccountButton () {
            return Ext.os.deviceType !== "Phone";
        },

        showAdministrationButton () {
            return this.$app.user.hasPermissions( "administration:read" ) && Ext.os.deviceType !== "Phone";
        },

        showDevelopmentButton () {
            return this.$app.user.hasPermissions( "development:read" ) && Ext.os.deviceType !== "Phone";
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

        async showAccountDialog () {
            this.hide();

            this.$emit( "showAccountDialog" );
        },

        async showChangePasswordDialog () {
            this.hide();

            const cmp = await this.$mount( ChangePasswordDialog );

            cmp.ext.show();
        },

        async showAdministrationDialog () {
            this.hide();

            const module = await import( "#src/components/administration/dialog" );

            const cmp = await this.$mount( module.default );

            cmp.ext.show();
        },

        async showDevelopmentDialog () {
            this.hide();

            const module = await import( "#src/components/development/dialog" );

            const cmp = await this.$mount( module.default );

            cmp.ext.show();
        },

        signout () {
            this.hide();

            this.$app.signOut();
        },

        async showAboutDialog () {
            this.hide();

            const cmp = await this.$mount( AboutDialog );

            cmp.ext.show();
        },
    },
};
</script>

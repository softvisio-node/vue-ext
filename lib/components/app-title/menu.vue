<template>
    <ext-sheet layout="vbox" modal="true" side="right" width="300" @ready="ready">
        <ext-panel height="120" innerCls="x-tabbar" layout="vbox" padding="10 10 10 30">
            <AvatarUser height="60" width="60"/>
            <ext-container :html="email" margin="5 0 0 0" style="font-size: 1.3em; color: white"/>
            <ext-container :hidden="!isRoot" :html="i18nd(`vue-ext`, `root user`)" style="font-size: 1.3em; color: white"/>
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

        <ext-container layout='{"align":"start","type":"hbox"}' margin="0 10 0 10">
            <ext-container flex="1" :html="version" style="opacity: 0.7"/>
            <ext-button iconCls="fa-regular fa-copy" :tooltip="i18nd(`vue-ext`, `Copy version info to clipboard`)" @tap="_copyVersion"/>
        </ext-container>
    </ext-sheet>
</template>

<script>
import AvatarUser from "#lib/components/avatar/user";
import LocaleButton from "#lib/components/locale.button";
import ChangePasswordDialog from "#lib/components/change-password.dialog";
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
        isRoot () {
            return this.$app.isRoot;
        },

        email () {
            return this.$app.user.email;
        },

        version () {
            const backendGitId = this.$app.backendGitId || {},
                frontendGitId = this.$app.frontendGitId || {};

            return `<b>ui</b>: ${this._createVersionString( frontendGitId )}, <b>api</b>: ${this._createVersionString( backendGitId )}`;
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

        _copyVersion () {
            this.$utils.copyToClipboard( JSON.stringify(
                {
                    "backend": this.$app.backendGitId,
                    "frontend": this.$app.frontendGitId,
                },
                null,
                4
            ) );

            this.$utils.toast( this.i18nd( "vue-ext", "Version info copied" ) );
        },

        _createVersionString ( data ) {
            var html = "";

            html += "v" + data.currentVersion;

            if ( data.currentVersionDistance ) html += "+" + data.currentVersionDistance;

            if ( data.mode === "development" ) {
                html += "&nbsp;" + this.$utils.labelError( "dev" );
            }

            return html;
        },
    },
};
</script>

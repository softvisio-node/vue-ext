<template>
    <ext-sheet layout="vbox" side="right" modal="true" width="300" @ready="ready">
        <ext-panel layout="vbox" height="130" padding="30 10 10 30" innerCls="x-tabbar">
            <Avatar width="60" height="60"/>
            <ext-container :html="username"/>
        </ext-panel>

        <ext-panel layout="vbox" flex="1" padding="10 10 10 30">
            <slot name="top"/>

            <ext-spacer/>

            <slot name="bottomUp"/>

            <ext-button iconCls="fa-solid fa-key" :text="i18n(`API tokens`)" textAlign="left" :hidden="!apiTokens" @tap="showApiTokens"/>
            <ext-button iconCls="fa-solid fa-user" :text="i18n(`Your profile`)" textAlign="left" :hidden="!profile" @tap="showProfile"/>
            <ext-button iconCls="fa-solid fa-asterisk" :text="i18n(`Change password`)" textAlign="left" :hidden="!changePassword" @tap="showChangePasswordDialog"/>

            <slot name="bottomDown"/>

            <LocaleButton :autoHide="true"/>
            <ext-button iconCls="fa-solid fa-sign-out-alt" :text="i18n(`Sign out`)" textAlign="left" @tap="signout"/>

            <ext-container layout="hbox">
                <ext-togglefield :boxLabel='`<i class="fa-solid fa-adjust"></i> ` + i18n(`Dark mode`)' :value="darkMode" @change="darkMode = $event"/>
            </ext-container>
        </ext-panel>
    </ext-sheet>
</template>

<script>
import Avatar from "./avatar";
import LocaleButton from "#lib/components/locale/button";
import ChangePasswordDialog from "#components/change-password-dialog";
import ApiTokensDialog from "#components/api-tokens/dialog";

export default {
    "components": { Avatar, LocaleButton },

    "props": {
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
        username () {
            return '<div class="username">' + this.$store.session.username + "</div>";
        },

        "darkMode": {
            get () {
                return this.$store.theme.darkMode;
            },

            set ( e ) {
                this.$store.theme.setDarkMode( e.detail.newValue );
            },
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

        async showProfile () {
            this.$emit( "showProfileDialog" );
        },

        async showApiTokens () {
            this.hide();

            const cmp = await this.$mount( ApiTokensDialog );

            cmp.ext.show();
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

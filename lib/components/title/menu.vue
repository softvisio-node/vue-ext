<template>
    <ext-sheet layout="vbox" side="right" modal="true" displayed="false" width="300" @ready="ready">
        <ext-panel layout="vbox" height="130" padding="30 10 10 30" innerCls="x-tabbar">
            <Avatar width="60" height="60"/>
            <ext-container :html="username"/>
        </ext-panel>

        <ext-panel layout="vbox" flex="1" padding="10 10 10 30">
            <slot name="top"/>

            <ext-spacer/>

            <slot name="bottomUp"/>

            <ext-button iconCls="fas fa-key" text="API Access Tokens" textAlign="left" :hidden="apiTokens !== 'true'" @tap="showApiTokens"/>
            <ext-button iconCls="fas fa-user" text="Your Profile" textAlign="left" :hidden="profile !== 'true'" @tap="showProfile"/>
            <ext-button iconCls="fas fa-asterisk" text="Change Password" textAlign="left" :hidden="changePassword !== 'true'" @tap="showChangePasswordDialog"/>

            <slot name="bottomDown"/>

            <ext-button iconCls="fas fa-sign-out-alt" text="Sign Out" textAlign="left" @tap="signout"/>

            <ext-container layout="hbox">
                <ext-togglefield boxLabel='<i class="fas fa-adjust"></i> DARK MODE' :value="darkMode" @change="darkMode = $event"/>
            </ext-container>
        </ext-panel>
    </ext-sheet>
</template>

<script>
import Avatar from "./avatar";
import ChangePasswordDialog from "../change-password-dialog";
import ApiTokensDialog from "../api-tokens/dialog";

export default {
    "components": { Avatar },

    "props": {
        "apiTokens": {
            "type": String,
            "default": "true",
        },
        "profile": {
            "type": String,
            "default": "true",
        },
        "changePassword": {
            "type": String,
            "default": "false",
        },
    },

    "emits": ["showProfileDialog"],

    "computed": {
        avatar () {
            return this.$store.session.avatar;
        },

        username () {
            return '<div class="username">' + this.$store.session.username + "</div>";
        },

        "darkMode": {
            get () {
                return this.$store.theme.darkMode + "";
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

            this.$store.session.signout();
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

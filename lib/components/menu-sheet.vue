<template>
    <ext-sheet layout="vbox" side="right" modal="true" displayed="false" cover="true" reveal="false" width="300" @ready="ready">
        <ext-panel layout="vbox" height="130" padding="30 10 10 30" innerCls="x-tabbar">
            <ext-image :src="avatar" width="60" height="60"/>
            <ext-container :html="username"/>
        </ext-panel>

        <ext-panel layout="vbox" flex="1" padding="10 10 10 30">
            <slot/>

            <ext-spacer/>

            <ext-button iconCls="fas fa-key" text="API Access Tokens" textAlign="left" :hidden="noApiTokens" @tap="showApiTokens"/>
            <ext-button iconCls="fas fa-user" text="Profile" textAlign="left" @tap="showProfile"/>
            <ext-button iconCls="fas fa-asterisk" text="Change Password" textAlign="left" @tap="changePassword"/>
            <ext-button iconCls="fas fa-sign-out-alt" text="Sign Out" textAlign="left" @tap="signout"/>

            <ext-container layout="hbox">
                <ext-togglefield label="DARK MODE" labelAlign="right" :value="darkMode" @change="darkMode = $event"/>
            </ext-container>
        </ext-panel>
    </ext-sheet>
</template>

<script>
import ChangePasswordDialog from "./change-password-dialog";
import ProfileDialog from "./profile/dialog";
import ApiTokensDialog from "./api-tokens/dialog";

export default {
    "props": {
        "noApiTokens": {
            "type": Boolean,
            "default": false,
        },
    },

    "computed": {
        avatar () {
            return this.$store.getters["session/avatar"];
        },

        username () {
            return '<div class="username">' + this.$store.getters["session/username"] + "</div>";
        },

        "darkMode": {
            get () {
                return this.$store.getters["theme/darkMode"];
            },

            set ( ev ) {
                this.$store.dispatch( "theme/setDarkMode", ev.detail.newValue );
            },
        },
    },

    created () {

        // disable viewport gestures, menu can be opened only by button click
        Ext.Viewport.addedSwipeListener = true;
    },

    "methods": {
        ready ( e ) {
            this.$ext = e.detail.cmp;
        },

        show () {
            this.$ext.show();
        },

        hide () {
            this.$ext.hide();
        },

        async showProfile () {
            this.hide();

            if ( !this.profileDialog ) this.profileDialog = await Ext.Viewport.addVue( ProfileDialog );

            this.profileDialog.$ext.show();
        },

        async showApiTokens () {
            this.hide();

            if ( !this.apiTokensDialog ) this.apiTokensDialog = await Ext.Viewport.addVue( ApiTokensDialog );

            this.apiTokensDialog.$ext.show();
        },

        async changePassword () {
            this.hide();

            if ( !this.changePasswordDialog ) this.changePasswordDialog = await Ext.Viewport.addVue( ChangePasswordDialog );

            this.changePasswordDialog.$ext.show();
        },

        signout () {
            this.hide();

            this.$store.dispatch( "session/signout" );
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

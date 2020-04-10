<template>
    <ext-sheet layout="vbox" side="right" modal="true" displayed="false" cover="true" reveal="false" width="300" @ready="ready">
        <ext-panel layout="vbox" height="130" padding="30 10 10 30" innerCls="x-tabbar">
            <ext-image :src="avatar" width="60" height="60"/>
            <ext-container :html="userName"/>
        </ext-panel>

        <ext-panel layout="vbox" flex="1" padding="10 10 10 30">
            <slot/>

            <ext-spacer/>

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

export default {
    "computed": {
        avatar () {
            return this.$store.getters["session/avatar"];
        },

        userName () {
            return '<div class="username">' + this.$store.getters["session/userName"] + "</div>";
        },

        "darkMode": {
            get () {
                return this.$store.getters["session/darkMode"];
            },

            set ( ev ) {
                this.$store.commit( "session/darkMode", ev.detail.newValue );
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

        changePassword () {
            this.hide();

            Ext.Viewport.addComponent( ChangePasswordDialog );
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

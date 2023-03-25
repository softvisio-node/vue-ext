<template>
    <ext-panel height="100%" layout='{"animation":"slide","type":"card"}' maxHeight="500" :shadow="shadow" width="300" @ready="ready">
        <ext-titlebar docked="top" :title="title" titleAlign="left">
            <LocaleButton :absolute="true"/>
        </ext-titlebar>

        <SigninForm :errorTarget="errorTarget" :passwordRecoveryEnabled="passwordRecoveryEnabled" :signupEnabled="signupEnabled" @recover="showPasswordRecovery" @signup="showSignup"/>

        <PasswordRecoveryForm :errorTarget="errorTarget" @signin="showSignin"/>

        <SignupForm :errorTarget="errorTarget" @signin="showSignin"/>
    </ext-panel>
</template>

<script>
import LocaleButton from "#src/components/locale.button";
import SigninForm from "./signin.form";
import PasswordRecoveryForm from "./password-recovery.form";
import SignupForm from "./signup.form";
import sessionStore from "#vue/store/session";

export default {
    "components": { LocaleButton, SigninForm, PasswordRecoveryForm, SignupForm },

    "props": {
        "errorTarget": {
            "type": String,
            "default": "under",
        },
        "passwordRecoveryEnabled": {
            "type": Boolean,
            "default": true,
        },
        "closable": {
            "type": Boolean,
            "default": false,
        },
        "shadow": {
            "type": Boolean,
            "default": true,
        },
    },

    "emits": ["close"],

    "computed": {
        title () {
            return sessionStore.title;
        },

        signupEnabled () {
            return this.$app.signupEnabled;
        },
    },

    "methods": {
        ready ( e ) {
            this.ext = e.detail.cmp;

            // TODO fix for forms switch, remove
            this.ext.setActiveItem( 0 );

            if ( this.closable ) {
                this.ext.setTools( [
                    {
                        "type": "close",
                        "handler": this.close.bind( this ),
                    },
                ] );
            }
        },

        close () {
            this.$emit( "close" );
        },

        showSignin () {
            this.ext.setActiveItem( 0 );
        },

        showPasswordRecovery () {
            this.ext.setActiveItem( 1 );
        },

        showSignup () {
            this.ext.setActiveItem( 2 );
        },
    },
};
</script>

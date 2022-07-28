<template>
    <ext-panel layout='{"animation":"slide","type":"card"}' minHeight="380" :shadow="shadow" width="300" @ready="ready">
        <ext-titlebar docked="top" :title="title" titleAlign="left">
            <LocaleButton :absolute="true"/>
        </ext-titlebar>

        <SigninForm :resetPasswordEnabled="resetPasswordEnabled" :signupEnabled="signupEnabled" @reset="showResetPassword" @signup="showSignup"/>

        <ResetPasswordForm @signin="showSignin"/>

        <SignupForm @signin="showSignin"/>
    </ext-panel>
</template>

<script>
import LocaleButton from "#lib/components/locale/button";
import SigninForm from "./signin-form";
import ResetPasswordForm from "./reset-password-form";
import SignupForm from "./signup-form";

export default {
    "components": { LocaleButton, SigninForm, ResetPasswordForm, SignupForm },

    "props": {
        "signupEnabled": {
            "type": Boolean,
            "default": false,
        },
        "resetPasswordEnabled": {
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
            return this.$store.session.title;
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

        showResetPassword () {
            this.ext.setActiveItem( 1 );
        },

        showSignup () {
            this.ext.setActiveItem( 2 );
        },
    },
};
</script>

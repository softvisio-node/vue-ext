<template>
    <ext-panel width="300" minHeight="380" layout='{"type":"card","animation":"slide"}' :shadow="shadow" @ready="ready">
        <ext-titlebar docked="top" titleAlign="left" :title="title" padding="0 0 0 0">
            <LocaleButton :compact="true" align="right" textAlign="center" menuAlign="tr-br?"/>
        </ext-titlebar>

        <SigninForm :signupEnabled="signupEnabled" :resetPasswordEnabled="resetPasswordEnabled" @reset="showResetPassword" @signup="showSignup"/>

        <ResetPasswordForm @signin="showSignin"/>

        <SignupForm @signin="showSignin"/>
    </ext-panel>
</template>

<script>
import LocaleButton from "#components/locale/button";
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

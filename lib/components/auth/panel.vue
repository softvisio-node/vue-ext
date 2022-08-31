<template>
    <ext-panel layout='{"animation":"slide","type":"card"}' minHeight="470" :shadow="shadow" width="300" @ready="ready">
        <ext-titlebar docked="top" :title="title" titleAlign="left">
            <LocaleButton :absolute="true"/>
        </ext-titlebar>

        <SigninForm :resetPasswordEnabled="resetPasswordEnabled" :signinFacebookEnabled="signinFacebookEnabled" :signinGitHubEnabled="signinGitHubEnabled" :signinGoogleEnabled="signinGoogleEnabled" :signupEnabled="signupEnabled" @reset="showResetPassword" @signup="showSignup"/>

        <PasswordRecoveryForm @signin="showSignin"/>

        <SignupForm @signin="showSignin"/>
    </ext-panel>
</template>

<script>
import LocaleButton from "#lib/components/locale.button";
import SigninForm from "./signin.form";
import PasswordRecoveryForm from "./password-recovery.form";
import SignupForm from "./signup.form";

export default {
    "components": { LocaleButton, SigninForm, PasswordRecoveryForm, SignupForm },

    "props": {
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

        signinGoogleEnabled () {
            return this.$store.session.settings.signin_google_enabled;
        },

        signinFacebookEnabled () {
            return this.$store.session.settings.signin_facebook_enabled;
        },

        signinGitHubEnabled () {
            return this.$store.session.settings.signin_github_enabled;
        },

        signupEnabled () {
            return this.$store.session.signupEnabled;
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

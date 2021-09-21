<template>
    <ext-panel :title="title" width="300" minHeight="380" layout='{"type":"card","animation":"slide"}' :shadow="shadow" @ready="ready">
        <SigninForm :signup="signup" :reset="reset" @reset="showReset" @signup="showSignup"/>

        <ResetPasswordForm @signin="showSignin"/>

        <SignupForm @signin="showSignin"/>
    </ext-panel>
</template>

<script>
import SigninForm from "./signin-form";
import ResetPasswordForm from "./reset-password-form";
import SignupForm from "./signup-form";

export default {
    "components": { SigninForm, ResetPasswordForm, SignupForm },

    "props": {
        "signup": {
            "type": Boolean,
            "default": false,
        },
        "reset": {
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

        showReset () {
            this.ext.setActiveItem( 1 );
        },

        showSignup () {
            this.ext.setActiveItem( 2 );
        },
    },
};
</script>

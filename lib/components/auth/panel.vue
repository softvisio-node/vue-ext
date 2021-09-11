<template>
    <ext-panel :title="title" width="300" minHeight="380" layout='{"type":"card","animation":"slide"}' :shadow="shadow" @ready="ready">
        <SigninForm :closable="closable" :signup="signup" :reset="reset" @close="close" @reset="showReset" @signup="showSignup"/>

        <ResetPasswordForm :closable="closable" @signin="showSignin" @close="close"/>

        <SignupForm :closable="closable" @signin="showSignin" @close="close"/>
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
            "type": String,
            "default": "false",
        },
        "reset": {
            "type": String,
            "default": "true",
        },
        "closable": {
            "type": String,
            "default": "false",
        },
        "shadow": {
            "type": String,
            "default": "true",
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

        onSignin () {
            if ( this.closable === "true" ) this.close();
        },
    },
};
</script>

<template>
    <ext-panel width="300" minHeight="450" layout='{"type":"card","animation":"slide"}' :shadow="shadow" @ready="ready">
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
            "type": Boolean,
            "default": false,
        },
        "reset": {
            "type": Boolean,
            "default": false,
        },
        "closable": {
            "type": Boolean,
            "default": false,
        },
        "shadow": {
            "type": Boolean,
            "default": false,
        },
    },

    "methods": {
        ready ( e ) {
            this.cmp = e.detail.cmp;

            // TODO fix for forms switch, remove
            this.cmp.setActiveItem( 0 );
        },

        close () {
            this.$emit( "close" );
        },

        showSignin () {
            this.cmp.setActiveItem( 0 );
        },

        showReset () {
            this.cmp.setActiveItem( 1 );
        },

        showSignup () {
            this.cmp.setActiveItem( 2 );
        },

        onSignin () {
            if ( this.closable ) this.close();
        },
    },
};
</script>

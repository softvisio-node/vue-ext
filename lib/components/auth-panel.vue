<template>
    <ext-panel width="300" minHeight="450" layout='{"type":"card","animation":"slide"}' :shadow="shadow" @ready="ready">
        <SigninForm :closable="closable" :signup="signup" :recover="recover" @close="close" @recover="showRecover" @signup="showSignup"/>

        <RecoverPasswordForm :closable="closable" @signin="showSignin" @close="close"/>

        <SignupForm :closable="closable" @signin="showSignin" @close="close"/>
    </ext-panel>
</template>

<script>
import SigninForm from "./auth-panel/signin-form";
import RecoverPasswordForm from "./auth-panel/recover-password-form";
import SignupForm from "./auth-panel/signup-form";

export default {
    "components": { SigninForm, RecoverPasswordForm, SignupForm },

    "props": {
        "signup": {
            "type": Boolean,
            "default": false,
        },
        "recover": {
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

        showRecover () {
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

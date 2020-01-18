<template>
    <ext-panel layout='{"type":"card","animation":"slide"}' fullscreen="true" @ready="ready">
        <SigninForm :signup="signup" :recover="recover" @recover="showRecover" @signup="showSignup"/>

        <RecoverPasswordForm @signin="showSignin"/>

        <SignupForm @signin="showSignin"/>
    </ext-panel>
</template>

<script>
import SigninForm from "./signin-form";
import RecoverPasswordForm from "./recover-password-form";
import SignupForm from "./signup-form";

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
    },

    "methods": {
        ready ( e ) {
            this.cmp = e.detail.cmp;
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
    },
};
</script>

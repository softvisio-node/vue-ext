<template>
    <ext-panel layout='{"type":"card","animation":"slide"}' fullscreen="true" @ready="ready">
        <SigninForm @forgotPassword="forgotPassword"/>

        <RecoverPasswordForm @signin="signin"/>

        <SignupForm @signin="signin"/>
    </ext-panel>
</template>

<script>
import SigninForm from "./signin-form";
import RecoverPasswordForm from "./recover-password-form";
import SignupForm from "./signup-form";

export default {
    "components": { SigninForm, RecoverPasswordForm, SignupForm },

    "methods": {
        ready ( e ) {
            this.cmp = e.detail.cmp;
        },

        signin () {
            this.cmp.setActiveItem( 0 );
        },

        forgotPassword () {
            this.cmp.setActiveItem( 1 );
        },

        signup () {
            this.cmp.setActiveItem( 2 );
        },
    },
};
</script>

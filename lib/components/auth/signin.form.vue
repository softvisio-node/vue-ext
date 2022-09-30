<template>
    <ext-panel layout='{"align":"center","type":"vbox"}' scrollable="true">
        <ext-toolbar docked="top">
            <ext-spacer/>
            <ext-container :html="i18nd(`vue-ext`, `Sign in`)"/>
            <ext-spacer/>
        </ext-toolbar>

        <ext-fieldpanel ref="form" defaults='{"margin":"0 0 0 0"}' width="100%" @ready="_ready">
            <ext-emailfield :errorTarget="errorTarget" :label="i18nd(`vue-ext`, `Email address`)" name="email" :placeholder="i18nd(`vue-ext`, `Enter your email address`)" required="true" validators="email"/>

            <ext-passwordfield :errorTarget="errorTarget" :label="i18nd(`vue-ext`, `Password`)" name="password" :placeholder="i18nd(`vue-ext`, `Enter password`)" required="true" revealable="true"/>
        </ext-fieldpanel>

        <ext-button :hidden="!passwordRecoveryEnabled" padding="10 0 0 0" :text="i18nd(`vue-ext`, `Forgot password?`)" @tap="showPasswordRecovery"/>

        <!-- oauth -->
        <OauthContainer @tap="_oauthTap"/>

        <ext-button :hidden="!signupEnabled" padding="10 0 0 0" :text="i18nd(`vue-ext`, `Do not have account? Sign up`)" @tap="showSignup"/>

        <ext-toolbar docked="bottom">
            <ext-spacer/>
            <ext-button :text="i18nd(`vue-ext`, `Sign in`)" ui="action" @tap="_submit"/>
        </ext-toolbar>
    </ext-panel>
</template>

<script>
import OauthContainer from "#lib/components/oauth.container";

export default {
    "components": { OauthContainer },

    "props": {
        "errorTarget": {
            "type": String,
            "default": "qtip",
        },
        "signupEnabled": {
            "type": Boolean,
            "default": false,
        },
        "passwordRecoveryEnabled": {
            "type": Boolean,
            "default": false,
        },
    },

    "emits": ["recover", "signup"],

    "methods": {
        _ready ( e ) {
            var cmp = e.detail.cmp;

            cmp.setKeyMap( { "ENTER": { "handler": "_submit", "scope": this } } );
        },

        showPasswordRecovery () {
            this.$emit( "recover" );
        },

        showSignup () {
            this.$emit( "signup" );
        },

        _submit () {
            const form = this.$refs.form.ext;

            if ( !form.validate() ) {
                this.$utils.toast( this.i18nd( `vue-ext`, `Please, correctly fill all required fields` ) );

                return;
            }

            const values = form.getValues();

            this._signin( values );
        },

        _oauthTap ( oauthProvider ) {
            this._signin( { oauthProvider } );
        },

        async _signin ( options ) {
            Ext.Viewport.mask();

            const res = await this.$app.signin( options );

            if ( !res.ok ) {
                Ext.Viewport.unmask();

                this.$utils.toast( res );
            }
        },
    },
};
</script>

<template>
    <ext-panel layout='{"align":"center","type":"vbox"}' scrollable="true">
        <ext-toolbar docked="top">
            <ext-spacer/>
            <ext-container :html="i18nd(`vue-ext`, `Sign in`)"/>
            <ext-spacer/>
        </ext-toolbar>

        <ext-fieldpanel ref="form" defaults='{"margin":"0 0 0 0"}' width="100%" @ready="_ready">
            <ext-emailfield :label="i18nd(`vue-ext`, `Email address`)" name="email" :placeholder="i18nd(`vue-ext`, `Enter your email address`)" required="true" validators="email"/>

            <ext-passwordfield :label="i18nd(`vue-ext`, `Password`)" name="password" :placeholder="i18nd(`vue-ext`, `Enter your password`)" required="true"/>
        </ext-fieldpanel>

        <ext-button :hidden="!resetPasswordEnabled" padding="10 0 0 0" :text="i18nd(`vue-ext`, `Forgot password?`)" @tap="showReset"/>

        <ext-container defaults='{"margin":"0 20 0 20","ui":"action"}' layout='{"pack":"center","type":"hbox"}' padding="10 0 0 0">
            <ext-button :hidden="!signinGoogleEnabled" iconCls="fa-brands fa-google" :tooltip="i18nd(`vue-ext`, `Sign in with Google`)"/>

            <ext-button :hidden="!signinFacebookEnabled" iconCls="fa-brands fa-square-facebook" :tooltip="i18nd(`vue-ext`, `Sign in with Facebook`)"/>

            <ext-button :hidden="!signinGitHubEnabled" iconCls="fa-brands fa-github" :tooltip="i18nd(`vue-ext`, `Sign in with GitHub`)"/>
        </ext-container>

        <ext-button :hidden="!signupEnabled" padding="10 0 0 0" :text="i18nd(`vue-ext`, `Do not have account? Sign up`)" @tap="showSignup"/>

        <ext-toolbar docked="bottom">
            <ext-spacer/>
            <ext-button :text="i18nd(`vue-ext`, `Sign in`)" ui="action" @tap="_submit"/>
        </ext-toolbar>
    </ext-panel>
</template>

<script>
export default {
    "props": {
        "signinGoogleEnabled": {
            "type": Boolean,
            "default": false,
        },
        "signinFacebookEnabled": {
            "type": Boolean,
            "default": false,
        },
        "signinGitHubEnabled": {
            "type": Boolean,
            "default": false,
        },
        "signupEnabled": {
            "type": Boolean,
            "default": false,
        },
        "resetPasswordEnabled": {
            "type": Boolean,
            "default": false,
        },
    },

    "emits": ["reset", "signup"],

    "methods": {
        _ready ( e ) {
            var cmp = e.detail.cmp;

            cmp.setKeyMap( { "ENTER": { "handler": "_submit", "scope": this } } );
        },

        showReset () {
            this.$emit( "reset" );
        },

        showSignup () {
            this.$emit( "signup" );
        },

        async _submit () {
            const form = this.$refs.form.ext;

            if ( !form.validate() ) {
                this.$utils.toast( this.i18nd( `vue-ext`, `Please, correctly fill all required fields` ) );

                return;
            }

            const values = form.getValues();

            Ext.Viewport.mask();

            const res = await this.$app.signin( values );

            if ( !res.ok ) {
                Ext.Viewport.unmask();

                this.$utils.toast( res );
            }
        },
    },
};
</script>

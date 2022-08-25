<template>
    <ext-fieldpanel ref="form" @ready="_ready">
        <ext-toolbar docked="top">
            <ext-spacer/>
            <ext-container :html="i18nd(`vue-ext`, `Sign in`)"/>
            <ext-spacer/>
        </ext-toolbar>

        <ext-textfield :label="i18nd(`vue-ext`, `Username or email`)" name="username" :placeholder="i18nd(`vue-ext`, `Enter your username or email`)" required="true"/>
        <ext-passwordfield :label="i18nd(`vue-ext`, `Password`)" name="password" :placeholder="i18nd(`vue-ext`, `Enter your password`)" required="true"/>

        <ext-button :hidden="!signupEnabled" margin="20 0 0 0" :text="i18nd(`vue-ext`, `Do not have account? Sign up`)" width="100%" @tap="showSignup"/>

        <ext-toolbar docked="bottom">
            <ext-button :hidden="!resetPasswordEnabled" :text="i18nd(`vue-ext`, `Forgot password?`)" ui="forward" @tap="showReset"/>
            <ext-spacer/>
            <ext-button :text="i18nd(`vue-ext`, `Sign in`)" ui="action" @tap="_submit"/>
        </ext-toolbar>
    </ext-fieldpanel>
</template>

<script>
export default {
    "props": {
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
            var form = this.$refs.form.ext;

            if ( form.validate() ) {
                const vals = form.getValues();

                Ext.Viewport.mask();

                const res = await this.$app.signin( vals );

                if ( !res.ok ) {
                    Ext.Viewport.unmask();

                    this.$utils.toast( res );
                }
            }
        },
    },
};
</script>

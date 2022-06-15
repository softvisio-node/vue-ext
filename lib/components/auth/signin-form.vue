<template>
    <ext-formpanel ref="form" @ready="ready">
        <ext-toolbar docked="top">
            <ext-spacer/>
            <ext-container :html="i18nd(`vue-ext`, `Sign in`)"/>
            <ext-spacer/>
        </ext-toolbar>
        <ext-textfield name="username" :label="i18nd(`vue-ext`, `Username or email`)" required="true"/>
        <ext-passwordfield name="password" :label="i18nd(`vue-ext`, `Password`)" required="true"/>

        <ext-button :text="i18nd(`vue-ext`, `Do not have account? Sign up`)" :hidden="!signupEnabled" width="100%" margin="10 0 0 0" @tap="showSignup"/>

        <ext-toolbar docked="bottom" layout='{"type":"hbox","align":"center"}'>
            <ext-button :text="i18nd(`vue-ext`, `Forgot password?`)" ui="forward" :hidden="!resetPasswordEnabled" @tap="showReset"/>
            <ext-spacer/>
            <ext-button :text="i18nd(`vue-ext`, `Sign in`)" ui="action" @tap="submit"/>
        </ext-toolbar>
    </ext-formpanel>
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
        ready ( e ) {
            var cmp = e.detail.cmp;

            cmp.setKeyMap( { "ENTER": { "handler": "submit", "scope": this } } );
        },

        showReset () {
            this.$emit( "reset" );
        },

        showSignup () {
            this.$emit( "signup" );
        },

        async submit () {
            var form = this.$refs.form.ext;

            if ( form.validate() ) {
                var vals = form.getValues();

                Ext.Viewport.mask();

                var res = await this.$app.signin( vals );

                if ( !res.ok ) {
                    Ext.Viewport.unmask();

                    this.$utils.toast( res );
                }
            }
        },
    },
};
</script>

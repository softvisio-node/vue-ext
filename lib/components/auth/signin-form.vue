<template>
    <ext-formpanel ref="form" @ready="ready">
        <ext-toolbar docked="top">
            <ext-spacer/>
            <ext-container :html="i18n(`Sign in`)"/>
            <ext-spacer/>
        </ext-toolbar>
        <ext-textfield name="username" :label="i18n(`User name or email`)" required="true"/>
        <ext-passwordfield name="password" :label="i18n(`Password`)" required="true"/>

        <ext-button :text="i18n(`Do not have account? Sign up`)" :hidden="!signup" width="100%" margin="10 0 0 0" @tap="showSignup"/>

        <ext-toolbar docked="bottom" layout='{"type":"hbox","align":"center"}'>
            <ext-button :text="i18n(`Forgot password?`)" ui="forward" :hidden="!reset" @tap="showReset"/>
            <ext-spacer/>
            <ext-button :text="i18n(`Sign in`)" ui="action" @tap="submit"/>
        </ext-toolbar>
    </ext-formpanel>
</template>

<script>
export default {
    "props": {
        "signup": {
            "type": Boolean,
            "default": false,
        },
        "reset": {
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

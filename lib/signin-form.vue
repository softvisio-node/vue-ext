<template>
    <ext-panel layout="center">
        <ext-formpanel ref="form" width="300" minHeight="350" title="Sign In" shadow="true" scrollable="true" @ready="formReady">
            <ext-textfield name="username" label="User Name or Email" required="true" allowBlank="false"/>
            <ext-passwordfield name="password" label="Password" required="true"/>

            <ext-button text="Do not have account? Sign up" :hidden="!signup" width="100%" margin="30 0 0 0" @tap="showSignup"/>

            <ext-toolbar docked="bottom" layout='{"type":"hbox","align":"center"}'>
                <ext-button text="Forgot password?" ui="forward" :hidden="!recover" @tap="showRecover"/>
                <ext-spacer/>
                <ext-button text="Sign in" ui="action" @tap="submit"/>
            </ext-toolbar>
        </ext-formpanel>
    </ext-panel>
</template>

<script>
export default {
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
        formReady ( e ) {
            var cmp = e.detail.cmp;

            cmp.setKeyMap( { "ENTER": { "handler": "submit", "scope": this } } );
        },

        showRecover () {
            this.$emit( "recover" );
        },

        showSignup () {
            this.$emit( "signup" );
        },

        async submit () {
            var form = this.$refs.form.ext;

            if ( form.validate() ) {
                var vals = form.getValues();

                Ext.Viewport.mask();

                var res = await this.$store.dispatch( "session/signin", vals );

                Ext.Viewport.unmask();

                if ( !res.isSuccess() ) {
                    Ext.toast( res.toString() );
                }
            }
        },
    },
};
</script>

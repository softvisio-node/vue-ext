<template>
    <ext-formpanel ref="form" @ready="ready">
        <ext-toolbar docked="top">
            <ext-spacer/>
            <ext-container html="Sign In"/>
            <ext-spacer/>
        </ext-toolbar>
        <ext-textfield name="username" label="User Name or Email" required="true"/>
        <ext-passwordfield name="password" label="Password" required="true"/>

        <ext-button text="Do not have account? Sign up" :hidden="signup !== 'true'" width="100%" margin="10 0 0 0" @tap="showSignup"/>

        <ext-toolbar docked="bottom" layout='{"type":"hbox","align":"center"}'>
            <ext-button text="Forgot password?" ui="forward" :hidden="reset !== 'true'" @tap="showReset"/>
            <ext-spacer/>
            <ext-button text="Sign in" ui="action" @tap="submit"/>
        </ext-toolbar>
    </ext-formpanel>
</template>

<script>
export default {
    "props": {
        "closable": {
            "type": String,
            "default": "false",
        },
        "signup": {
            "type": String,
            "default": "false",
        },
        "reset": {
            "type": String,
            "default": "false",
        },
    },
    "emits": ["close", "reset", "signup"],

    "methods": {
        ready ( e ) {
            var cmp = e.detail.cmp;

            cmp.setKeyMap( { "ENTER": { "handler": "submit", "scope": this } } );

            if ( this.closable === "true" ) {
                cmp.setTools( [
                    {
                        "type": "close",
                        "handler": this.close.bind( this ),
                    },
                ] );
            }
        },

        close () {
            this.$emit( "close" );
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

                var res = await this.$store.session.signin( vals );

                Ext.Viewport.unmask();

                if ( !res.ok ) {
                    this.$utils.toast( res );
                }
                else {
                    if ( this.closable === "true" ) this.close();
                }
            }
        },
    },
};
</script>

<template>
    <ext-formpanel ref="form" title="Sign In" @ready="ready">
        <ext-textfield name="username" label="User Name or Email" required="true"/>
        <ext-passwordfield name="password" label="Password" required="true"/>

        <ext-button text="Do not have account? Sign up" :hidden="!signup" width="100%" margin="10 0 0 0" @tap="showSignup"/>

        <ext-toolbar docked="bottom" layout='{"type":"hbox","align":"center"}'>
            <ext-button text="Forgot password?" ui="forward" :hidden="!reset" @tap="showReset"/>
            <ext-spacer/>
            <ext-button text="Sign in" ui="action" @tap="submit"/>
        </ext-toolbar>
    </ext-formpanel>
</template>

<script>
export default {
    "props": {
        "closable": {
            "type": Boolean,
            "default": false,
        },
        "signup": {
            "type": Boolean,
            "default": false,
        },
        "reset": {
            "type": Boolean,
            "default": false,
        },
    },

    "methods": {
        ready ( e ) {
            var cmp = e.detail.cmp;

            cmp.setKeyMap( { "ENTER": { "handler": "submit", "scope": this } } );

            if ( this.closable ) {
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

                var res = await this.$store.dispatch( "session/signin", vals );

                Ext.Viewport.unmask();

                if ( !res.ok ) {
                    this.$.toast( res );
                }
                else {
                    if ( this.closable ) this.close();
                }
            }
        },
    },
};
</script>

<template>
    <ext-formpanel ref="form" title="Sign Up" @ready="ready">
        <ext-emailfield name="username" label="Email" required="true"/>
        <ext-passwordfield name="password" label="Password" required="true"/>
        <ext-passwordfield ref="passwordConfirm" label="Confirm Password" required="true"/>

        <ext-toolbar docked="bottom" layout='{"type":"hbox","align":"center"}'>
            <ext-button iconCls="fas fa-arrow-left" text="Sign In" ui="back" @tap="showSignin"/>
            <ext-spacer/>
            <ext-button text="Sign Up" ui="action" @tap="submit"/>
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

        showSignin () {
            this.$emit( "signin" );

            this.$refs.form.ext.reset();
        },

        async submit () {
            var form = this.$refs.form.ext,
                passwordCondirm = this.$refs.passwordConfirm.ext;

            if ( !form.validate() ) return;

            var vals = form.getValues();

            if ( vals.password !== passwordCondirm.getValue() ) {
                passwordCondirm.setError( "Passwords are not match" );

                return;
            }

            Ext.Viewport.mask();

            const res = await this.$store.dispatch( "session/signup", vals );

            Ext.Viewport.unmask();

            if ( res.isOk() ) {
                this.$.toast( res );

                form.reset();
                this.$refs.passwordConfirm.ext.clearValue();

                this.showSignin();
            }
            else {
                this.$.toast( res );
            }
        },
    },
};
</script>

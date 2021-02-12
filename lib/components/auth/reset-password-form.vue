<template>
    <ext-formpanel ref="form" title="Reset Password" @ready="ready">
        <ext-textfield name="username" label="User Name or Email" required="true"/>

        <ext-toolbar docked="bottom" layout='{"type":"hbox","align":"center"}'>
            <ext-button iconCls="fas fa-arrow-left" text="Sign In" ui="back" @tap="showSignin"/>
            <ext-spacer/>
            <ext-button text="Reset" ui="action" @tap="submit"/>
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
    "emits": ["close", "signin"],

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
            var form = this.$refs.form.ext;

            if ( form.validate() ) {
                var vals = form.getValues();

                Ext.Viewport.mask();

                var res = await this.$store.session.sendPasswordResetEmail( vals.username );

                Ext.Viewport.unmask();

                if ( !res.ok ) {
                    this.$utils.toast( res );
                }
                else {
                    form.reset();

                    this.$utils.toast( "Password change instructions were sent to the email address, associated with your account.", 5000 );

                    this.showSignin();
                }
            }
        },
    },
};
</script>

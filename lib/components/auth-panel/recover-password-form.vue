<template>
    <ext-formpanel ref="form" title="Recover Password" @ready="ready">
        <ext-textfield name="username" label="User Name or Email" required="true"/>

        <ext-toolbar docked="bottom" layout='{"type":"hbox","align":"center"}'>
            <ext-button iconCls="fas fa-arrow-left" text="Sign In" ui="back" @tap="showSignin"/>
            <ext-spacer/>
            <ext-button text="Recover" ui="action" @tap="submit"/>
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
            var form = this.$refs.form.ext;

            if ( form.validate() ) {
                var vals = form.getValues();

                Ext.Viewport.mask();

                var res = await this.$store.dispatch( "session/recoverPassword", vals.username );

                Ext.Viewport.unmask();

                if ( !res.isSuccess() ) {
                    this.$toast( res );
                }
                else {
                    form.reset();

                    this.$toast( "Password change instructions was sent to the email address, associated with your account.", 5000 );
                }
            }
        },
    },
};
</script>

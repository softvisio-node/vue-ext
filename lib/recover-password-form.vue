<template>
    <ext-panel layout="center">
        <ext-formpanel ref="form" width="300" minHeight="350" title="Recover Password" shadow="true" scrollable="true" @ready="formReady">
            <ext-textfield name="username" label="User Name or Email" required="true" allowBlank="false"/>

            <ext-toolbar docked="bottom" layout='{"type":"hbox","align":"center"}'>
                <ext-button iconCls="fas fa-arrow-left" text="Sign In" ui="back" @tap="showSignin"/>
                <ext-spacer/>
                <ext-button text="Recover" ui="action" @tap="submit"/>
            </ext-toolbar>
        </ext-formpanel>
    </ext-panel>
</template>

<script>
export default {
    "methods": {
        formReady ( e ) {
            var cmp = e.detail.cmp;

            cmp.setKeyMap( { "ENTER": { "handler": "submit", "scope": this } } );
        },

        showSignin () {
            this.$emit( "signin" );
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
                    this.$toast( "Password change instructions was sent to the email address, associated with your account.", 5000 );
                }
            }
        },
    },
};
</script>

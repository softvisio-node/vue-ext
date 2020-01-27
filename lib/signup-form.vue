<template>
    <ext-panel layout="center">
        <ext-formpanel ref="form" title="Sign Up" width="300" minHeight="350" shadow="true" scrollable="true" @ready="formReady">
            <ext-emailfield name="username" label="Email" required="true" allowBlank="false"/>
            <ext-passwordfield name="password" label="Password" allowBlank="false" required="true"/>
            <ext-passwordfield ref="passwordConfirm" label="Confirm Password" allowBlank="false" required="true"/>

            <ext-toolbar docked="bottom" layout='{"type":"hbox","align":"center"}'>
                <ext-button iconCls="fas fa-arrow-left" text="Sign In" ui="back" @tap="showSignin"/>
                <ext-spacer/>
                <ext-button text="Sign Up" ui="action" @tap="submit"/>
            </ext-toolbar>
        </ext-formpanel>
    </ext-panel>
</template>

<script>
import( "#ewc/ext-emailfield.component" );

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

            if ( res.isSuccess() ) {
                Ext.toast( "You were registered." );

                this.showSignin();
            }
            else {
                Ext.toast( res.toString() );
            }
        },
    },
};
</script>

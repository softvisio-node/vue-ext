<template>
    <ext-formpanel ref="form" @ready="ready">
        <ext-toolbar docked="top">
            <ext-spacer/>
            <ext-container html="Sign Up"/>
            <ext-spacer/>
        </ext-toolbar>
        <ext-emailfield name="username" label="Email" required="true"/>
        <ext-passwordfield name="password" label="Password" required="true"/>
        <ext-passwordfield ref="passwordConfirm" label="Confirm Password" required="true"/>

        <ext-toolbar docked="bottom" layout='{"type":"hbox","align":"center"}'>
            <ext-button iconCls="fa-solid fa-arrow-left" text="Sign In" ui="back" @tap="showSignin"/>
            <ext-spacer/>
            <ext-button text="Sign Up" ui="action" @tap="submit"/>
        </ext-toolbar>
    </ext-formpanel>
</template>

<script>
export default {
    "emits": ["signin"],

    "methods": {
        ready ( e ) {
            var cmp = e.detail.cmp;

            cmp.setKeyMap( { "ENTER": { "handler": "submit", "scope": this } } );
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

            const res = await this.$app.signup( vals );

            Ext.Viewport.unmask();

            if ( res.ok ) {
                this.$utils.toast( res, 5000 );

                // reset form
                form.reset();
                this.$refs.passwordConfirm.ext.clearValue();

                this.showSignin();
            }
            else {
                this.$utils.toast( res );
            }
        },
    },
};
</script>

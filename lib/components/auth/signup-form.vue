<template>
    <ext-formpanel ref="form" @ready="ready">
        <ext-toolbar docked="top">
            <ext-spacer/>
            <ext-container :html="i18n(`Sign up`)"/>
            <ext-spacer/>
        </ext-toolbar>
        <ext-emailfield name="username" :label="i18n(`Email`)" required="true"/>
        <ext-passwordfield name="password" :label="i18n(`Password`)" required="true"/>
        <ext-passwordfield ref="passwordConfirm" :label="i18n(`Confirm password`)" required="true"/>

        <ext-toolbar docked="bottom" layout='{"type":"hbox","align":"center"}'>
            <ext-button iconCls="fa-solid fa-arrow-left" :text="i18n(`Sign in`)" ui="back" @tap="showSignin"/>
            <ext-spacer/>
            <ext-button :text="i18n(`Sign up`)" ui="action" @tap="submit"/>
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

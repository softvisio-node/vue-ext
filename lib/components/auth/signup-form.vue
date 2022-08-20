<template>
    <ext-formpanel ref="form" @ready="_ready">
        <ext-toolbar docked="top">
            <ext-spacer/>
            <ext-container :html="i18nd(`vue-ext`, `Sign up`)"/>
            <ext-spacer/>
        </ext-toolbar>
        <ext-emailfield :label="i18nd(`vue-ext`, `Email`)" name="username" :placeholder="i18nd(`vue-ext`, `Enter your email`)" required="true"/>
        <ext-passwordfield :label="i18nd(`vue-ext`, `Password`)" name="password" :placeholder="i18nd(`vue-ext`, `Enter your password`)" required="true"/>
        <ext-passwordfield ref="passwordConfirm" :label="i18nd(`vue-ext`, `Confirm password`)" :placeholder="i18nd(`vue-ext`, `Confirm your password`)" required="true"/>

        <ext-toolbar docked="bottom" layout='{"align":"center","type":"hbox"}'>
            <ext-button iconCls="fa-solid fa-arrow-left" :text="i18nd(`vue-ext`, `Back`)" ui="back" @tap="showSignin"/>
            <ext-spacer/>
            <ext-button :text="i18nd(`vue-ext`, `Sign up`)" ui="action" @tap="_submit"/>
        </ext-toolbar>
    </ext-formpanel>
</template>

<script>
export default {
    "emits": ["signin"],

    "methods": {
        _ready ( e ) {
            var cmp = e.detail.cmp;

            cmp.setKeyMap( { "ENTER": { "handler": "_submit", "scope": this } } );
        },

        showSignin () {
            this.$emit( "signin" );

            this.$refs.form.ext.reset();
        },

        async _submit () {
            const form = this.$refs.form.ext,
                passwordCondirm = this.$refs.passwordConfirm.ext;

            if ( !form.validate() ) return;

            const vals = form.getValues();

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

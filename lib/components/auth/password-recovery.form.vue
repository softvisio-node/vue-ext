<template>
    <ext-fieldpanel ref="form" @ready="_ready">
        <ext-toolbar docked="top">
            <ext-spacer/>
            <ext-container :html="i18nd(`vue-ext`, `Password recovery`)"/>
            <ext-spacer/>
        </ext-toolbar>
        <ext-textfield :label="i18nd(`vue-ext`, `Username or email`)" name="username" :placeholder="i18nd(`vue-ext`, `Enter your username or email`)" required="true"/>

        <ext-toolbar docked="bottom">
            <ext-button iconCls="fa-solid fa-arrow-left" :text="i18nd(`vue-ext`, `Back`)" ui="back" @tap="showSignin"/>
            <ext-spacer/>
            <ext-button :text="i18nd(`vue-ext`, `Recover`)" ui="action" @tap="_submit"/>
        </ext-toolbar>
    </ext-fieldpanel>
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
            const form = this.$refs.form.ext;

            if ( form.validate() ) {
                const vals = form.getValues();

                Ext.Viewport.mask();

                const res = await this.$store.session.sendPasswordRecoveryEmail( vals.username );

                Ext.Viewport.unmask();

                if ( !res.ok ) {
                    this.$utils.toast( res );
                }
                else {
                    form.reset();

                    this.$utils.toast( this.i18nd( `vue-ext`, "Password change instructions were sent to the email address, associated with your account." ), 5000 );

                    this.showSignin();
                }
            }
        },
    },
};
</script>

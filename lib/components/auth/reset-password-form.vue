<template>
    <ext-formpanel ref="form" @ready="ready">
        <ext-toolbar docked="top">
            <ext-spacer/>
            <ext-container :html="i18nd(`vue-ext`, `Reset password`)"/>
            <ext-spacer/>
        </ext-toolbar>
        <ext-textfield name="username" :label="i18nd(`vue-ext`, `Username or email`)" required="true"/>

        <ext-toolbar docked="bottom" layout='{"type":"hbox","align":"center"}'>
            <ext-button iconCls="fa-solid fa-arrow-left" :text="i18nd(`vue-ext`, `Back`)" ui="back" @tap="showSignin"/>
            <ext-spacer/>
            <ext-button :text="i18nd(`vue-ext`, `Reset`)" ui="action" @tap="submit"/>
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

                    this.$utils.toast( this.i18nd( `vue-ext`, "Password change instructions were sent to the email address, associated with your account." ), 5000 );

                    this.showSignin();
                }
            }
        },
    },
};
</script>

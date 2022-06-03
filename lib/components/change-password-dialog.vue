<template>
    <ext-dialog :title="i18n(`Change Password`)" width="300" height="300" closeAction="hide" @ready="_ready">
        <ext-fieldpanel ref="form" defaults='{"labelAlign":"left","labelWidth":120}' @ready="formReady">
            <ext-passwordfield name="password" :label="i18n(`Password`)" required="true"/>
            <ext-passwordfield ref="passwordConfirm" :label="i18n(`Confirm Password`)" required="true"/>
        </ext-fieldpanel>

        <ext-toolbar docked="bottom" layout='{"type":"hbox","pack":"end"}'>
            <ext-button :text="i18n(`Cancel`)" ui="decline" @tap="close"/>
            <ext-button :text="i18n(`Submit`)" ui="action" @tap="submit"/>
        </ext-toolbar>
    </ext-dialog>
</template>

<script>
export default {
    "methods": {
        _ready ( e ) {
            this.ext = e.detail.cmp;

            this.ext.on( "hide", () => {
                this.$refs.form.ext.reset();

                this.$refs.passwordConfirm.ext.clearValue();
            } );
        },

        formReady ( e ) {
            var cmp = e.detail.cmp;

            cmp.setKeyMap( { "ENTER": { "handler": "submit", "scope": this } } );
        },

        close () {
            this.ext.hide();
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

            const res = await this.$store.session.setPassword( vals.password );

            Ext.Viewport.unmask();

            if ( res.ok ) {
                this.$utils.toast( this.i18n( "Password changed" ) );

                this.close();
            }
            else {
                this.$utils.toast( res );
            }
        },
    },
};
</script>

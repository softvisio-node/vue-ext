<template>
    <ext-dialog title="Change Password" width="300" height="300" displayed="true" closable="true" draggable="false" closeAction="hide" hideOnMaskTap="true" @ready="ready">
        <ext-fieldpanel ref="form" defaults='{"labelAlign":"left","labelWidth":120}' @ready="formReady">
            <ext-passwordfield name="password" label="Password" required="true"/>
            <ext-passwordfield ref="passwordConfirm" label="Confirm Password" required="true"/>
        </ext-fieldpanel>

        <ext-toolbar docked="bottom" layout='{"type":"hbox","pack":"end"}'>
            <ext-button text="Cancel" ui="decline" @tap="close"/>
            <ext-button text="Submit" ui="action" @tap="submit"/>
        </ext-toolbar>
    </ext-dialog>
</template>

<script>
export default {
    "methods": {
        ready ( e ) {
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
                this.$util.toast( "Password changed." );

                this.close();
            }
            else {
                this.$util.toast( res );
            }
        },
    },
};
</script>

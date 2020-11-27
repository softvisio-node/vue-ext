<template>
    <ext-dialog title="Reset Password" layout="fit" width="300" minHeight="450" displayed="true" closable="true" draggable="false" closeAction="destroy" hideOnMaskTap="true" @destroy="cancel" @ready="ready">
        <ext-fieldpanel ref="form" defaults1='{"labelAlign":"left","labelWidth":120}'>
            <ext-hiddenfield name="token" :value="token"/>
            <ext-passwordfield name="password" label="New Password" required="true"/>
            <ext-passwordfield ref="passwordConfirm" label="Confirm New Password" required="true"/>
        </ext-fieldpanel>

        <ext-toolbar docked="bottom" layout='{"type":"hbox","pack":"end"}'>
            <ext-button text="Cancel" ui="decline" @tap="cancel"/>
            <ext-button text="Reset Password" ui="action" @tap="submit"/>
        </ext-toolbar>
    </ext-dialog>
</template>

<script>
export default {
    "computed": {
        token () {
            const hash = window.location.hash;

            const found = hash.match( /^#[/]reset-password[/]?(.*)/ );

            if ( found ) {
                return found[1];
            }
            else {
                return null;
            }
        },
    },

    "methods": {
        ready ( e ) {
            this.ext = e.detail.cmp;

            if ( !this.token ) {
                this.$.toast( "Password reset token was not found.", 5000 );

                this.cancel();

                return;
            }

            this.ext.on( "hide", () => {
                this.cancel();
            } );

            this.$refs.form.ext.setKeyMap( { "ENTER": { "handler": "submit", "scope": this } } );
        },

        cancel () {
            this.$router.redirectTo( "/", { "replace": true } );

            this.$destroy();
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

            form.mask();

            const res = await this.$store.dispatch( "session/setPasswordByToken", [vals.token, vals.password] );

            form.unmask();

            if ( res.ok ) {
                this.$.toast( "Password changed." );

                this.cancel();
            }
            else {
                this.$.toast( res );
            }
        },
    },
};
</script>

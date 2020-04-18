<template>
    <ext-dialog title="Recover Password" width="300" height="300" displayed="true" closable="true" draggable="false" closeAction="destroy" @destroy="cancel">
        <ext-fieldpanel ref="form" defaults1='{"labelAlign":"left","labelWidth":120}'>
            <ext-textfield name="token" label="Token" required="true" :value="token"/>
            <ext-passwordfield name="password" label="New Password" required="true"/>
            <ext-passwordfield ref="passwordConfirm" label="Confirm New Password" required="true"/>
        </ext-fieldpanel>

        <ext-toolbar docked="bottom" layout='{"type":"hbox","pack":"end"}'>
            <ext-button text="Cancel" ui="decline" @tap="cancel"/>
            <ext-button text="Submit" ui="action" @tap="submit"/>
        </ext-toolbar>
    </ext-dialog>
</template>

<script>
export default {
    "computed": {
        token () {
            const hash = window.location.hash;

            const found = hash.match( /^#[/]recover-password[/]?(.*)/ );

            if ( found ) {
                return found[1];
            }
            else {
                return null;
            }
        },
    },

    "methods": {
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

            const res = await this.$store.dispatch( "session/setPassword", [vals.token, vals.password] );

            form.unmask();

            if ( res.isSuccess() ) {
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

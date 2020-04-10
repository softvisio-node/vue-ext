<template>
    <ext-dialog title="Create User" width="350" height="400" displayed="true" closable="true" draggable="false" closeAction="destroy">
        <ext-fieldpanel ref="form" defaults='{"labelAlign":"left","labelWidth":120}' @ready="formReady">
            <ext-emailfield name="username" label="Email" required="true"/>
            <ext-passwordfield name="password" label="Password" required="true"/>
            <ext-passwordfield name="password1" label="Confirm Password" required="true"/>
            <ext-togglefield name="enabled" label="Enabled" value="true"/>
            <ext-togglefield name="admin" label="Admin" value="false"/>
        </ext-fieldpanel>

        <ext-toolbar docked="bottom">
            <ext-spacer/>
            <ext-button text="Cancel" ui="decline" @tap="cancel"/>
            <ext-button text="Create User" ui="action" @tap="submit"/>
        </ext-toolbar>
    </ext-dialog>
</template>

<script>
export default {
    "methods": {
        formReady ( e ) {
            var cmp = e.detail.cmp;

            cmp.setKeyMap( { "ENTER": { "handler": "submit", "scope": this } } );
        },

        cancel () {
            this.$destroy();
        },

        async submit () {
            var form = this.$refs.form.ext;

            if ( !form.validate() ) return;

            var vals = form.getValues();

            if ( vals.password !== vals.password1 ) {
                form.getFields( "password1" ).setError( "Passwords are not match" );

                return;
            }

            if ( vals.admin ) {
                vals.permissions = {
                    "admin": true,
                };
            }

            delete vals.admin;

            var res = await this.$api.call( "admin/users/create", vals );

            if ( res.isSuccess() ) {
                this.$toast( "User created" );

                this.$store.state.userStore.reload();

                this.cancel();
            }
            else {
                this.$toast( res );
            }
        },
    },
};
</script>

<template>
    <ext-dialog :title="i18n(`Create User`)" width="350" height="400" closeAction="hide" @ready="_ready">
        <ext-fieldpanel ref="form" defaults='{"labelAlign":"top"}' @ready="formReady">
            <ext-emailfield name="username" :label="i18n(`Email`)" :placeholder="i18n(`Enter user email`)" required="true"/>
            <ext-passwordfield name="password" :label="i18n(`Password`)" :placeholder="i18n(`Enter user password`)" required="true"/>
            <ext-passwordfield name="password1" :label="i18n(`Confirm password`)" :placeholder="i18n(`Confirm user password`)" required="true"/>
            <ext-togglefield name="enabled" :label="i18n(`Login enabled`)" value="true"/>
            <ext-togglefield name="admin" :label="i18n(`Admin`)" value="false"/>
        </ext-fieldpanel>

        <ext-toolbar docked="bottom">
            <ext-spacer/>
            <ext-button :text="i18n(`Create User`)" ui="action" @tap="submit"/>
        </ext-toolbar>
    </ext-dialog>
</template>

<script>
export default {
    "methods": {
        async _ready ( e ) {
            this.ext = e.detail.cmp;

            this.ext.on( "hide", () => this.$refs.form.ext.reset() );
        },

        formReady ( e ) {
            var cmp = e.detail.cmp;

            cmp.setKeyMap( { "ENTER": { "handler": "submit", "scope": this } } );
        },

        close () {
            this.ext.hide();
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
            delete vals.password1;

            var res = await this.$api.call( "admin/users/create", vals );

            if ( res.ok ) {
                this.$utils.toast( this.i18n( "User created" ) );

                this.$store.users.reload();

                this.close();
            }
            else {
                this.$utils.toast( res );
            }
        },
    },
};
</script>

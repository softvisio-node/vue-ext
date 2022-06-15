<template>
    <ext-dialog :title="i18nd(`vue-ext`, `Create user`)" width="350" height="400" closeAction="hide" scrollable="true" @ready="_ready">
        <ext-fieldpanel ref="form" @ready="formReady">
            <ext-emailfield name="username" :label="i18nd(`vue-ext`, `Email`)" :placeholder="i18nd(`vue-ext`, `Enter user email`)" required="true"/>
            <ext-passwordfield name="password" :label="i18nd(`vue-ext`, `Password`)" :placeholder="i18nd(`vue-ext`, `Enter user password`)" required="true"/>
            <ext-passwordfield name="password1" :label="i18nd(`vue-ext`, `Confirm password`)" :placeholder="i18nd(`vue-ext`, `Confirm user password`)" required="true"/>
            <ext-togglefield name="enabled" :label="i18nd(`vue-ext`, `User enabled`)" labelAlign="left" labelWidth="150" value="true"/>
            <ext-togglefield name="admin" :label="i18nd(`vue-ext`, `Administrator`)" labelAlign="left" labelWidth="150" value="false"/>
        </ext-fieldpanel>

        <ext-toolbar docked="bottom">
            <ext-spacer/>
            <ext-button :text="i18nd(`vue-ext`, `Create user`)" ui="action" @tap="submit"/>
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
                this.$utils.toast( this.i18nd( `vue-ext`, "User created" ) );

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

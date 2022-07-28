<template>
    <ext-dialog layout="fit" minHeight="450" :title="i18nd(`vue-ext`, `Reset password`)" width="300" @destroy="close" @ready="_ready">
        <ext-fieldpanel ref="form" defaults1='{"labelAlign":"left","labelWidth":120}'>
            <ext-hiddenfield name="token" :value="token"/>
            <ext-passwordfield :label="i18nd(`vue-ext`, `New password`)" name="password" required="true"/>
            <ext-passwordfield ref="passwordConfirm" :label="i18nd(`vue-ext`, `Confirm new password`)" required="true"/>
        </ext-fieldpanel>

        <ext-toolbar docked="bottom" layout='{"type":"hbox","pack":"end"}'>
            <ext-button :text="i18nd(`vue-ext`, `Cancel`)" ui="decline" @tap="close"/>
            <ext-button :text="i18nd(`vue-ext`, `Reset password`)" ui="action" @tap="submit"/>
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
        _ready ( e ) {
            this.ext = e.detail.cmp;

            if ( !this.token ) {
                this.$utils.toast( this.i18nd( `vue-ext`, "Password reset token was not found" ), 5000 );

                this.close();
            }

            this.ext.on( "hide", () => this.close() );

            this.$refs.form.ext.setKeyMap( { "ENTER": { "handler": "submit", "scope": this } } );
        },

        close () {
            this.$router.redirectTo( "/", { "replace": true } );

            this.$unmount();
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

            const res = await this.$store.session.setPasswordByToken( [vals.token, vals.password] );

            form.unmask();

            if ( res.ok ) {
                this.$utils.toast( this.i18nd( `vue-ext`, "Password changed" ) );

                this.close();
            }
            else {
                this.$utils.toast( res );
            }
        },
    },
};
</script>

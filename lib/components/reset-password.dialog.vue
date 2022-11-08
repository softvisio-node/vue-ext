<template>
    <ext-dialog layout='{"align":"center","type":"vbox"}' minHeight="450" :title="i18nd(`vue-ext`, `Password change`)" width="350" @destroy="close" @ready="_ready">
        <ext-fieldpanel ref="form" width="100%">
            <ext-hiddenfield name="token" :value="token"/>

            <ext-passwordfield :errorTarget="errorTarget" :label="i18nd(`vue-ext`, `New password`)" name="password" :placeholder="i18nd(`vue-ext`, `Enter new password`)" required="true" revealable="true"/>

            <ext-passwordfield :errorTarget="errorTarget" :label="i18nd(`vue-ext`, `Confirm new password`)" name="confirmedPassword" :placeholder="i18nd(`vue-ext`, `Confirm new password`)" required="true" revealable="true"/>
        </ext-fieldpanel>

        <ext-button :text="i18nd(`vue-ext`, `Generate random password`)" @tap="_generatePassword"/>

        <ext-toolbar docked="bottom" layout='{"pack":"end","type":"hbox"}'>
            <ext-button :text="i18nd(`vue-ext`, `Cancel`)" ui="decline" @tap="close"/>
            <ext-button :text="i18nd(`vue-ext`, `Change password`)" ui="action" @tap="_submit"/>
        </ext-toolbar>
    </ext-dialog>
</template>

<script>
import passwords from "#core/utils/passwords";

export default {
    "props": {
        "errorTarget": {
            "type": String,
            "default": "under",
        },
    },

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
                this.$utils.toast( this.i18nd( `vue-ext`, "Password recovery token was not found" ), 5000 );

                this.close();
            }

            this.$refs.form.ext.getFields( "password" ).setValidators( {
                "type": "password-strength",
                "strength": this.$app.settings.passwordsStrength,
            } );

            this.ext.on( "hide", () => this.close() );

            this.$refs.form.ext.setKeyMap( { "ENTER": { "handler": "_submit", "scope": this } } );
        },

        close () {
            this.$router.redirectTo( "/", { "replace": true } );

            this.$unmount();
        },

        async _submit () {
            const form = this.$refs.form.ext;

            if ( !form.validate() ) return;

            const values = form.getValues();

            if ( values.password !== values.confirmedPassword ) {
                form.getFields( "confirmedPassword" ).setError( this.i18nd( "vue-ext", "Passwords do not match" ) );

                return;
            }

            form.mask();

            const res = await this.$api.call( "session/set-password-by-token", values.token, values.password );

            form.unmask();

            if ( res.ok ) {
                this.$utils.toast( this.i18nd( `vue-ext`, "Password changed" ) );

                this.close();
            }
            else {
                this.$utils.toast( res );
            }
        },

        _generatePassword () {
            const password = passwords.generatePassword().password;

            this.$utils.copyToClipboard( password );

            this.$utils.toast( this.i18nd( `vue-ext`, `Password copied to the clipboard` ) );

            this.$refs.form.ext.getFields( "password" ).setValue( password );
            this.$refs.form.ext.getFields( "confirmedPassword" ).setValue( password );
        },
    },
};
</script>

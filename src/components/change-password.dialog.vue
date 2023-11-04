<template>
    <ext-dialog height="350" layout="vbox" :title="title" width="300" @ready="_ready">
        <ext-container :html="header" style="text-align: center"/>

        <ext-fieldpanel ref="form">
            <ext-passwordfield :label="l10n(`New password`)" name="password" :placeholder="l10n(`Enter new password`)" required="true" revealable="true"/>

            <ext-passwordfield :label="l10n(`Confirm new password`)" name="confirmedPassword" :placeholder="l10n(`Confirm new password`)" required="true" revealable="true"/>
        </ext-fieldpanel>

        <ext-container layout="center">
            <ext-button :text="l10n(`Generate random password`)" @tap="_generatePassword"/>
        </ext-container>

        <ext-toolbar docked="bottom" layout='{"pack":"end","type":"hbox"}'>
            <ext-button :text="l10n(`Change password`)" ui="action" @tap="submit"/>
        </ext-toolbar>
    </ext-dialog>
</template>

<script>
import passwords from "#core/passwords";

export default {
    "computed": {
        title () {
            return this.l10n( `Password change` );
        },
    },

    "methods": {
        _ready ( e ) {
            this.ext = e.detail.cmp;

            this.ext.setKeyMap( { "ENTER": this.submit.bind( this ) } );

            this.$refs.form.ext.getFields( "password" ).setValidators( {
                "type": "password-strength",
                "strength": this.$app.settings.passwordsStrength,
            } );
        },

        async submit () {
            const form = this.$refs.form.ext;

            if ( !form.validate() ) return;

            const values = form.getValues();

            if ( values.password !== values.confirmedPassword ) {
                form.getFields( "confirmedPassword" ).setError( this.l10n( "Passwords do not match" ) );

                return;
            }

            this.ext.mask();

            const res = await this._changePassword( values.password );

            this.ext.unmask();

            if ( res.ok ) {
                this.$toast( this.l10n( "Password changed" ) );

                this.ext.close();
            }
            else {
                this.$toast( res );
            }
        },

        async _changePassword ( password ) {
            return this.$api.call( "account/set-password", password );
        },

        _generatePassword () {
            const password = passwords.generatePassword().password;

            this.$utils.copyToClipboard( password );

            this.$toast( this.l10n( `Password copied to the clipboard` ) );

            this.$refs.form.ext.getFields( "password" ).setValue( password );
            this.$refs.form.ext.getFields( "confirmedPassword" ).setValue( password );
        },
    },
};
</script>

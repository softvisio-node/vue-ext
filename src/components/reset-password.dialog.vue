<template>
    <ext-dialog layout="vbox" minHeight="450" :title="l10n(`Password change`, { domain: `vue-ext` })" width="350" @destroy="_onDestroy" @ready="_ready">
        <ext-fieldpanel ref="form">
            <ext-hiddenfield name="token" :value="token"/>

            <ext-passwordfield :errorTarget="errorTarget" :label="l10n(`New password`, { domain: `vue-ext` })" name="password" :placeholder="l10n(`Enter new password`, { domain: `vue-ext` })" required="true" revealable="true"/>

            <ext-passwordfield :errorTarget="errorTarget" :label="l10n(`Confirm new password`, { domain: `vue-ext` })" name="confirmedPassword" :placeholder="l10n(`Confirm new password`, { domain: `vue-ext` })" required="true" revealable="true"/>

            <ext-container layout="center">
                <ext-button :text="l10n(`Generate random password`, { domain: `vue-ext` })" @tap="_generatePassword"/>
            </ext-container>
        </ext-fieldpanel>

        <ext-toolbar docked="bottom" layout='{"pack":"end","type":"hbox"}'>
            <ext-button :text="l10n(`Cancel`, { domain: `vue-ext` })" ui="decline" @tap="close"/>
            <ext-button :text="l10n(`Change password`, { domain: `vue-ext` })" ui="action" @tap="_submit"/>
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
                this.$utils.toast( this.l10n( "Password recovery token was not found", { "domain": `vue-ext` } ), 5000 );

                this.close();
            }

            this.$refs.form.ext.getFields( "password" ).setValidators( {
                "type": "password-strength",
                "strength": this.$app.settings.passwordsStrength,
            } );

            this.$refs.form.ext.setKeyMap( { "ENTER": { "handler": "_submit", "scope": this } } );
        },

        _onDestroy () {
            this.$router.redirectTo( "/", { "replace": true } );
        },

        close () {
            this.ext.close();
        },

        async _submit () {
            const form = this.$refs.form.ext;

            if ( !form.validate() ) return;

            const values = form.getValues();

            if ( values.password !== values.confirmedPassword ) {
                form.getFields( "confirmedPassword" ).setError( this.l10n( "Passwords do not match", { "domain": "vue-ext" } ) );

                return;
            }

            form.mask();

            const res = await this.$api.call( "session/set-password-by-token", values.token, values.password );

            form.unmask();

            if ( res.ok ) {
                this.$utils.toast( this.l10n( "Password changed", { "domain": `vue-ext` } ) );

                this.close();
            }
            else {
                this.$utils.toast( res );
            }
        },

        _generatePassword () {
            const password = passwords.generatePassword().password;

            this.$utils.copyToClipboard( password );

            this.$utils.toast( this.l10n( `Password copied to the clipboard`, { "domain": `vue-ext` } ) );

            this.$refs.form.ext.getFields( "password" ).setValue( password );
            this.$refs.form.ext.getFields( "confirmedPassword" ).setValue( password );
        },
    },
};
</script>

<template>
    <ext-dialog closeAction="hide" height="400" layout="vbox" :title="title" width="350" @ready="_ready">
        <ext-container :html="header" style="text-align: center"/>

        <ext-fieldpanel ref="form" @ready="formReady">
            <ext-passwordfield :errorTarget="errorTarget" :label="i18nd(`vue-ext`, `New password`)" name="password" :placeholder="i18nd(`vue-ext`, `Enter new password`)" required="true" revealable="true"/>

            <ext-passwordfield :errorTarget="errorTarget" :label="i18nd(`vue-ext`, `Confirm new password`)" name="confirmedPassword" :placeholder="i18nd(`vue-ext`, `Confirm new password`)" required="true" revealable="true"/>
        </ext-fieldpanel>

        <ext-container layout="center">
            <ext-button :text="i18nd(`vue-ext`, `Generate random password`)" @tap="_generatePassword"/>
        </ext-container>

        <ext-toolbar docked="bottom" layout='{"pack":"end","type":"hbox"}'>
\ <ext-button :text="i18nd(`vue-ext`, `Change password`)" ui="action" @tap="submit"/>
</ext-toolbar>
    </ext-dialog>
</template>

<script>
import loadMask from "#lib/load-mask";
import passwords from "#core/utils/passwords";

export default {
    "props": {
        "errorTarget": {
            "type": String,
            "default": "under",
        },
    },

    "computed": {
        title () {
            return this.i18nd( `vue-ext`, `Password change` );
        },
    },

    "methods": {
        _ready ( e ) {
            this.ext = e.detail.cmp;

            this.$refs.form.ext.getFields( "password" ).setValidators( {
                "type": "password-strength",
                "strength": this.$app.settings.passwordsStrength,
            } );

            this.ext.on( "hide", () => {
                this.$refs.form.ext.reset();

                this.$refs.form.ext.getFields( "password" ).setRevealed( false );
                this.$refs.form.ext.getFields( "confirmedPassword" ).setRevealed( false );
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
            const form = this.$refs.form.ext;

            if ( !form.validate() ) return;

            const values = form.getValues();

            if ( values.password !== values.confirmedPassword ) {
                form.getFields( "confirmedPassword" ).setError( this.i18nd( "vue-ext", "Passwords do not match" ) );

                return;
            }

            this.ext.mask( loadMask );

            const res = await this._changePassword( values.password );

            this.ext.unmask();

            if ( res.ok ) {
                this.$utils.toast( this.i18nd( `vue-ext`, "Password changed" ) );

                this.close();
            }
            else {
                this.$utils.toast( res );
            }
        },

        async _changePassword ( password ) {
            return this.$api.call( "account/set-password", password );
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

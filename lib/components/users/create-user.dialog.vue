<template>
    <ext-dialog closeAction="hide" height="450" layout='{"align":"center","type":"vbox"}' scrollable="true" :title="i18nd(`vue-ext`, `Create user`)" width="350" @ready="_ready">
        <ext-fieldpanel ref="form" width="100%" @ready="formReady">
            <ext-emailfield :errorTarget="errorTarget" :label="i18nd(`vue-ext`, `Email`)" name="email" :placeholder="i18nd(`vue-ext`, `Enter email`)" required="true" validators="email"/>

            <ext-passwordfield :errorTarget="errorTarget" :label="i18nd(`vue-ext`, `Password`)" name="password" :placeholder="i18nd(`vue-ext`, `Enter password`)" required="true" revealable="true"/>

            <ext-passwordfield :errorTarget="errorTarget" :label="i18nd(`vue-ext`, `Confirm password`)" name="confirmedPassword" :placeholder="i18nd(`vue-ext`, `Confirm password`)" required="true" revealable="true"/>

            <ext-togglefield :label="i18nd(`vue-ext`, `Access enabled`)" labelAlign="left" labelWidth="150" name="enabled" value="true"/>
        </ext-fieldpanel>

        <ext-button :text="i18nd(`vue-ext`, `Generate random password`)" @tap="_generatePassword"/>

        <ext-toolbar docked="bottom">
            <ext-spacer/>
            <ext-button :text="i18nd(`vue-ext`, `Create user`)" ui="action" @tap="submit"/>
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

    "emits": ["created"],

    "methods": {
        async _ready ( e ) {
            this.ext = e.detail.cmp;

            this.$refs.form.ext.getFields( "password" ).setValidators( {
                "type": "password-strength",
                "strength": this.$store.session.settings.passwordsStrength,
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

            delete values.confirmedPassword;

            var res = await this.$api.call( "admin/users/create", values );

            if ( res.ok ) {
                this.$utils.toast( this.i18nd( `vue-ext`, "User created" ) );

                this.$emit( "created" );

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

<template>
    <ext-panel layout='{"align":"center","type":"vbox"}' scrollable="true" @ready="_ready">
        <ext-toolbar docked="top">
            <ext-spacer/>
            <ext-container :html="i18nd(`vue-ext`, `Sign up`)"/>
            <ext-spacer/>
        </ext-toolbar>

        <ext-fieldpanel ref="form" defaults='{"labelAlign":"top","margin":"0 0 0 0"}' width="100%">
            <ext-emailfield :errorTarget="errorTarget" :label="i18nd(`vue-ext`, `Email address`)" name="email" :placeholder="i18nd(`vue-ext`, `Enter your email address`)" required="true" validators="email"/>

            <ext-passwordfield :errorTarget="errorTarget" :label="i18nd(`vue-ext`, `Password`)" name="password" :placeholder="i18nd(`vue-ext`, `Enter password`)" required="true" revealable="true"/>

            <ext-passwordfield :errorTarget="errorTarget" :label="i18nd(`vue-ext`, `Confirm password`)" name="confirmedPassword" :placeholder="i18nd(`vue-ext`, `Confirm password`)" required="true" revealable="true"/>
        </ext-fieldpanel>

        <ext-button :text="i18nd(`vue-ext`, `Generate random password`)" @tap="_generatePassword"/>

        <!-- oauth -->
        <OauthContainer/>

        <ext-toolbar docked="bottom" layout='{"align":"center","type":"hbox"}'>
            <ext-button iconCls="fa-solid fa-arrow-left" :text="i18nd(`vue-ext`, `Back`)" @tap="back"/>
            <ext-spacer/>
            <ext-button :text="i18nd(`vue-ext`, `Sign up`)" ui="action" @tap="_submit"/>
        </ext-toolbar>
    </ext-panel>
</template>

<script>
import OauthContainer from "#lib/components/oaut.container";
import passwords from "#core/utils/passwords";

export default {
    "components": { OauthContainer },

    "props": {
        "errorTarget": {
            "type": String,
            "default": "qtip",
        },
    },

    "emits": ["signin"],

    "methods": {
        _ready ( e ) {
            const cmp = e.detail.cmp;

            this.$refs.form.ext.getFields( "password" ).setValidators( {
                "type": "password-strength",
                "strength": this.$store.session.settings.passwordsStrength,
            } );

            this.$refs.form.ext.setKeyMap( { "ENTER": { "handler": this._submit.bind( this ) } } );

            this._backListener = this.back.bind( this );

            cmp.on( "activate", () => {
                this.$app.on( "device/back-button", this._backListener );
            } );
        },

        back () {
            this.$app.off( "device/back-button", this._backListener );

            this.$emit( "signin" );

            this.$refs.form.ext.reset();

            this.$refs.form.ext.getFields( "password" ).setRevealed( false );
            this.$refs.form.ext.getFields( "confirmedPassword" ).setRevealed( false );
        },

        async _submit () {
            const form = this.$refs.form.ext;

            if ( !form.validate() ) {
                this.$utils.toast( this.i18nd( `vue-ext`, `Please, correctly fill all required fields` ) );

                return;
            }

            const values = form.getValues();

            if ( values.password !== values.confirmedPassword ) {
                form.getFields( "confirmedPassword" ).setError( this.i18nd( "vue-ext", "Passwords do not match" ) );

                return;
            }

            delete values.confirmedPassword;

            Ext.Viewport.mask();

            const res = await this.$app.signup( values );

            Ext.Viewport.unmask();

            if ( res.ok ) {
                this.$utils.toast( res, 5000 );

                this.back();
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

<template>
    <ext-panel layout="vbox" scrollable="true" @ready="_ready">
        <ext-toolbar docked="top">
            <ext-spacer/>
            <ext-container :html="l10n(`Sign up`, { domain: `vue-ext` })"/>
            <ext-spacer/>
        </ext-toolbar>

        <!-- oauth -->
        <ext-container layout="center">
            <OauthContainer margin="0 0 10 0" width="95%" @tap="_oauthTap"/>
        </ext-container>

        <ext-fieldpanel ref="form" defaults='{"margin":"0 0 0 0"}'>
            <ext-emailfield :errorTarget="errorTarget" :label="l10n(`Email address`, { domain: `vue-ext` })" name="email" :placeholder="l10n(`Enter your email address`, { domain: `vue-ext` })" required="true" validators="email"/>

            <ext-passwordfield :errorTarget="errorTarget" :label="l10n(`Password`, { domain: `vue-ext` })" name="password" :placeholder="l10n(`Enter password`, { domain: `vue-ext` })" required="true" revealable="true"/>

            <ext-passwordfield :errorTarget="errorTarget" :label="l10n(`Confirm password`, { domain: `vue-ext` })" name="confirmedPassword" :placeholder="l10n(`Confirm password`, { domain: `vue-ext` })" required="true" revealable="true"/>

            <ext-container layout="center">
                <ext-button :text="l10n(`Generate random password`, { domain: `vue-ext` })" @tap="_generatePassword"/>
            </ext-container>
        </ext-fieldpanel>

        <ext-toolbar docked="bottom" layout='{"align":"center","type":"hbox"}'>
            <ext-button iconCls="fa-solid fa-arrow-left" :text="l10n(`Back`, { domain: `vue-ext` })" @tap="back"/>
            <ext-spacer/>
            <ext-button :text="l10n(`Sign up`, { domain: `vue-ext` })" ui="action" @tap="_submit"/>
        </ext-toolbar>
    </ext-panel>
</template>

<script>
import OauthContainer from "#src/components/oauth.container";
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
                "strength": this.$app.settings.passwordsStrength,
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

        _generatePassword () {
            const password = passwords.generatePassword().password;

            this.$utils.copyToClipboard( password );

            this.$utils.toast( this.l10n( `Password copied to the clipboard`, { "domain": `vue-ext` } ) );

            this.$refs.form.ext.getFields( "password" ).setValue( password );
            this.$refs.form.ext.getFields( "confirmedPassword" ).setValue( password );
        },

        _submit () {
            const form = this.$refs.form.ext;

            if ( !form.validate() ) {
                this.$utils.toast( this.l10n( `Please, correctly fill all required fields`, { "domain": `vue-ext` } ) );

                return;
            }

            const values = form.getValues();

            if ( values.password !== values.confirmedPassword ) {
                form.getFields( "confirmedPassword" ).setError( this.l10n( "Passwords do not match", { "domain": "vue-ext" } ) );

                return;
            }

            delete values.confirmedPassword;

            const email = values.email;
            delete values.email;

            this._signUp( email, values );
        },

        _oauthTap ( oauthProvider ) {
            this._signUp( { oauthProvider } );
        },

        async _signUp ( email, fields ) {
            Ext.Viewport.mask();

            const res = await this.$app.signUp( email, fields );

            if ( res.ok ) {

                // sign in
                if ( res.data?.token ) return;

                Ext.Viewport.unmask();

                this.$utils.toast( res, 5000 );

                this.back();
            }
            else {
                Ext.Viewport.unmask();

                this.$utils.toast( res );
            }
        },
    },
};
</script>

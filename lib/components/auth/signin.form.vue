<template>
    <ext-panel layout='{"align":"center","type":"vbox"}' scrollable="true">
        <ext-toolbar docked="top">
            <ext-spacer/>
            <ext-container :html="i18nd(`vue-ext`, `Sign in`)"/>
            <ext-spacer/>
        </ext-toolbar>

        <ext-fieldpanel ref="form" defaults='{"labelAlign":"top","margin":"0 0 0 0"}' width="100%" @ready="_ready">
            <ext-emailfield :errorTarget="errorTarget" :label="i18nd(`vue-ext`, `Email address`)" name="email" :placeholder="i18nd(`vue-ext`, `Enter your email address`)" required="true" validators="email"/>

            <ext-passwordfield :errorTarget="errorTarget" :label="i18nd(`vue-ext`, `Password`)" name="password" :placeholder="i18nd(`vue-ext`, `Enter password`)" required="true" revealable="true"/>
        </ext-fieldpanel>

        <ext-button :hidden="!resetPasswordEnabled" padding="10 0 0 0" :text="i18nd(`vue-ext`, `Forgot password?`)" @tap="showReset"/>

        <ext-container defaults='{"margin":"0 20 0 20","ui":"action"}' layout='{"pack":"center","type":"hbox"}' padding="10 0 0 0">
            <ext-button :hidden="!signinGoogleEnabled" iconCls="fa-brands fa-google" :tooltip="i18nd(`vue-ext`, `Sign in with Google`)" @tap="_signinGoogle"/>

            <ext-button :hidden="!signinFacebookEnabled" iconCls="fa-brands fa-square-facebook" :tooltip="i18nd(`vue-ext`, `Sign in with Facebook`)"/>

            <ext-button :hidden="!signinGitHubEnabled" iconCls="fa-brands fa-github" :tooltip="i18nd(`vue-ext`, `Sign in with GitHub`)" @tap="_signinGitHub"/>
        </ext-container>

        <ext-button :hidden="!signupEnabled" padding="10 0 0 0" :text="i18nd(`vue-ext`, `Do not have account? Sign up`)" @tap="showSignup"/>

        <ext-toolbar docked="bottom">
            <ext-spacer/>
            <ext-button :text="i18nd(`vue-ext`, `Sign in`)" ui="action" @tap="_submit"/>
        </ext-toolbar>
    </ext-panel>
</template>

<script>
import { initializeApp } from "@firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "@firebase/auth";

export default {
    "props": {
        "errorTarget": {
            "type": String,
            "default": "qtip",
        },
        "signinGoogleEnabled": {
            "type": Boolean,
            "default": false,
        },
        "signinFacebookEnabled": {
            "type": Boolean,
            "default": false,
        },
        "signinGitHubEnabled": {
            "type": Boolean,
            "default": false,
        },
        "signupEnabled": {
            "type": Boolean,
            "default": false,
        },
        "resetPasswordEnabled": {
            "type": Boolean,
            "default": false,
        },
    },

    "emits": ["reset", "signup"],

    "methods": {
        _ready ( e ) {
            var cmp = e.detail.cmp;

            cmp.setKeyMap( { "ENTER": { "handler": "_submit", "scope": this } } );
        },

        showReset () {
            this.$emit( "reset" );
        },

        showSignup () {
            this.$emit( "signup" );
        },

        async _submit () {
            const form = this.$refs.form.ext;

            if ( !form.validate() ) {
                this.$utils.toast( this.i18nd( `vue-ext`, `Please, correctly fill all required fields` ) );

                return;
            }

            const values = form.getValues();

            Ext.Viewport.mask();

            const res = await this.$app.signin( values );

            if ( !res.ok ) {
                Ext.Viewport.unmask();

                this.$utils.toast( res );
            }
        },

        // https://firebase.google.com/docs/reference/js/v8/firebase.auth.GoogleAuthProvider
        async _signinGoogle () {
            const provider = new GoogleAuthProvider();

            // provider.addScope( "https://www.googleapis.com/auth/contacts.readonly" );

            provider.setCustomParameters( {

                // "login_hint": "zdm@softvisio.net",
            } );

            return this._signinFirebase( provider );
        },

        // https://firebase.google.com/docs/reference/js/v8/firebase.auth.GithubAuthProvider
        async _signinGitHub () {
            const provider = new GithubAuthProvider();

            // provider.addScope( "repo" );

            // provider.setCustomParameters( {

            //     // "login_hint": "zdm@softvisio.net",
            // } );

            return this._signinFirebase( provider );
        },

        async _signinFirebase ( provider ) {
            const firebaseApp = initializeApp( process.config.firebase.browser );

            const auth = getAuth( firebaseApp );

            auth.languageCode = "en-GB";

            // To apply the default browser preference instead of explicitly setting it.
            // firebase.auth().useDeviceLanguage();

            try {

                // https://firebase.google.com/docs/reference/js/v8/firebase.auth#usercredential
                var res = await signInWithPopup( auth, provider );
            }
            catch ( e ) {
                this.$utils.toast( this.i18nd( `vue-ext`, `Authorization error` ) );

                return;
            }

            console.log( JSON.stringify( res.user, null, 4 ) );

            const res1 = await this.$app.signin( {
                "email": res.user.providerData[0].email,
                "firebaseUserAccessToken": res.user.accessToken,
            } );

            if ( !res1.ok ) {
                Ext.Viewport.unmask();

                this.$utils.toast( res1 );
            }
        },
    },
};
</script>

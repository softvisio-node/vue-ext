<template>
    <ext-container defaults='{"margin":"0 20 0 20","ui":"action"}' layout='{"pack":"center","type":"hbox"}' padding="10 0 0 0">
        <ext-button :hidden="!signinGoogleEnabled" iconCls="fa-brands fa-google" :tooltip="i18nd(`vue-ext`, `Sign up with Google`)" @tap="_oauthGoogle"/>

        <ext-button :hidden="!signinFacebookEnabled" iconCls="fa-brands fa-square-facebook" :tooltip="i18nd(`vue-ext`, `Sign up with Facebook`)" @tap="_oauthFacebook"/>

        <ext-button :hidden="!signinGitHubEnabled" iconCls="fa-brands fa-github" :tooltip="i18nd(`vue-ext`, `Sign up with GitHub`)" @tap="_oauthGitHub"/>
    </ext-container>
</template>

<script>
import { initializeApp } from "@firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "@firebase/auth";

export default {
    "computed": {
        signinGoogleEnabled () {
            return this.$store.session.settings.signin_google_enabled;
        },

        signinFacebookEnabled () {
            return this.$store.session.settings.signin_facebook_enabled;
        },

        signinGitHubEnabled () {
            return this.$store.session.settings.signin_github_enabled;
        },
    },

    "methods": {

        // https://firebase.google.com/docs/reference/js/v8/firebase.auth.GoogleAuthProvider
        async _oauthGoogle () {
            const provider = new GoogleAuthProvider();

            // provider.addScope( "https://www.googleapis.com/auth/contacts.readonly" );

            provider.setCustomParameters( {

                // "login_hint": "zdm@softvisio.net",
            } );

            return this._signinFirebase( provider );
        },

        async _oauthFacebook () {},

        // https://firebase.google.com/docs/reference/js/v8/firebase.auth.GithubAuthProvider
        async _oauthGitHub () {
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

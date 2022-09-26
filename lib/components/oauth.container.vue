<template>
    <ext-container defaults='{"margin":"0 20 0 20","ui":"action"}' layout='{"pack":"center","type":"hbox"}' padding="10 0 0 0">
        <ext-button :hidden="!signinGoogleEnabled" iconCls="fa-brands fa-google" :tooltip="i18nd(`vue-ext`, `Sign up with Google`)" @tap="_oauthGoogle"/>

        <ext-button :hidden="!signinFacebookEnabled" iconCls="fa-brands fa-square-facebook" :tooltip="i18nd(`vue-ext`, `Sign up with Facebook`)" @tap="_oauthFacebook"/>

        <ext-button :hidden="!signinGitHubEnabled" iconCls="fa-brands fa-github" :tooltip="i18nd(`vue-ext`, `Sign up with GitHub`)" @tap="_oauthGitHub"/>
    </ext-container>
</template>

<script>
export default {
    "emits": ["begin", "end"],

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
        _oauthGoogle () {
            this._oauth( "google" );
        },

        _oauthFacebook () {
            this._oauth( "facebook" );
        },

        _oauthGitHub () {
            this._oauth( "github" );
        },

        async _oauth ( oauthProvider ) {
            this.$emit( "begin" );

            const res = await this.$store.session.signin( { oauthProvider } );

            this.$emit( "end", res );
        },
    },
};
</script>

<template>
    <ext-container defaults='{"margin":"0 20 0 20","ui":"action"}' layout='{"pack":"center","type":"hbox"}'>
        <ext-button :hidden="!signinGoogleEnabled" iconCls="fa-brands fa-google" :tooltip="i18nd(`vue-ext`, `Sign in with`) + ` Google`" @tap="_oauthGoogle"/>

        <ext-button :hidden="!signinFacebookEnabled" iconCls="fa-brands fa-square-facebook" :tooltip="i18nd(`vue-ext`, `Sign in with`) + ` Facebook`" @tap="_oauthFacebook"/>

        <ext-button :hidden="!signinGitHubEnabled" iconCls="fa-brands fa-github" :tooltip="i18nd(`vue-ext`, `Sign in with`) + ` GitHub`" @tap="_oauthGitHub"/>
    </ext-container>
</template>

<script>
export default {
    "emits": ["tap"],

    "computed": {
        signinGoogleEnabled () {
            return !!this.$app.settings.oauth_google_client_id;
        },

        signinFacebookEnabled () {
            return !!this.$app.settings.oauth_facebook_client_id;
        },

        signinGitHubEnabled () {
            return !!this.$app.settings.oauth_github_client_id;
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
            this.$emit( "tap", oauthProvider );
        },
    },
};
</script>

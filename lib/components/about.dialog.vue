<template>
    <ext-dialog closeAction="hide" height="400" layout="vbox" :title="i18nd(`vue-ext`, `About the project`)" width="350" @ready="_ready">
        <ext-container :html="header" style="text-align: center"/>

        <ext-fieldpanel ref="form" @ready="formReady">
            <ext-passwordfield :errorTarget="errorTarget" :label="i18nd(`vue-ext`, `New password`)" name="password" :placeholder="i18nd(`vue-ext`, `Enter new password`)" required="true" revealable="true"/>

            <ext-passwordfield :errorTarget="errorTarget" :label="i18nd(`vue-ext`, `Confirm new password`)" name="confirmedPassword" :placeholder="i18nd(`vue-ext`, `Confirm new password`)" required="true" revealable="true"/>
        </ext-fieldpanel>

        <ext-container layout="center">
            <ext-button :text="i18nd(`vue-ext`, `Generate random password`)" @tap="_generatePassword"/>
        </ext-container>

        <ext-toolbar docked="bottom" layout='{"pack":"end","type":"hbox"}'>
            <ext-button iconCls="fa-regular fa-copy" :text="i18nd(`vue-ext`, `Copy to clipboard`)" ui="action" @tap="_copy"/>
        </ext-toolbar>
    </ext-dialog>
</template>

<script>
export default {
    "props": {
        "errorTarget": {
            "type": String,
            "default": "under",
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

        _copy () {
            this.$utils.copyToClipboard( JSON.stringify(
                {
                    "backend": this.$app.backendGitId,
                    "frontend": this.$app.frontendGitId,
                },
                null,
                4
            ) );

            this.$utils.toast( this.i18nd( "vue-ext", "Version info copied" ) );
        },
    },
};
</script>

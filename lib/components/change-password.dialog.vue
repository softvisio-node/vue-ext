<template>
    <ext-dialog closeAction="hide" height="300" :title="title" width="300" @ready="_ready">
        <ext-container :html="header" style="text-align: center"/>

        <ext-fieldpanel ref="form" defaults='{"labelAlign":"top"}' @ready="formReady">
            <ext-passwordfield :errorTarget="errorTarget" :label="i18nd(`vue-ext`, `Password`)" name="password" required="true" revealable="true"/>

            <ext-passwordfield :errorTarget="errorTarget" :label="i18nd(`vue-ext`, `Confirm password`)" name="confirmedPassword" required="true" revealable="true"/>
        </ext-fieldpanel>

        <ext-toolbar docked="bottom" layout='{"pack":"end","type":"hbox"}'>
\ <ext-button :text="i18nd(`vue-ext`, `Change password`)" ui="action" @tap="submit"/>
</ext-toolbar>
    </ext-dialog>
</template>

<script>
import loadMask from "#lib/load-mask";

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
    },
};
</script>

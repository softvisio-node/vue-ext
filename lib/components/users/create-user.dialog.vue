<template>
    <ext-dialog closeAction="hide" height="450" scrollable="true" :title="i18nd(`vue-ext`, `Create user`)" width="350" @ready="_ready">
        <ext-fieldpanel ref="form" defaults='{"labelAlign":"top"}' @ready="formReady">
            <ext-emailfield :errorTarget="errorTarget" :label="i18nd(`vue-ext`, `Email`)" name="email" required="true" validators="email"/>

            <ext-passwordfield :errorTarget="errorTarget" :label="i18nd(`vue-ext`, `Password`)" name="password" required="true" revealable="true"/>

            <ext-passwordfield :errorTarget="errorTarget" :label="i18nd(`vue-ext`, `Confirm password`)" name="confirmedPassword" required="true" revealable="true"/>

            <ext-togglefield :label="i18nd(`vue-ext`, `Access enabled`)" labelAlign="left" labelWidth="150" name="enabled" value="true"/>
        </ext-fieldpanel>

        <ext-toolbar docked="bottom">
            <ext-spacer/>
            <ext-button :text="i18nd(`vue-ext`, `Create user`)" ui="action" @tap="submit"/>
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
    },
};
</script>

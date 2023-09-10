<template>
    <ext-dialog height="90%" layout="vbox" scrollable="true" :title="l10n(`User creation`, { domain: `vue-ext` })" width="600" @ready="_ready">
        <ext-fieldpanel ref="form" @ready="_onFormReady">
            <ext-emailfield :errorTarget="errorTarget" :label="l10n(`Email`, { domain: `vue-ext` })" labelAlign="left" labelWidth="150" name="email" :placeholder="l10n(`Enter email`, { domain: `vue-ext` })" required="true" validators="email"/>

            <ext-passwordfield :errorTarget="errorTarget" :label="l10n(`Password`, { domain: `vue-ext` })" labelAlign="left" labelWidth="150" name="password" :placeholder="l10n(`Enter password`, { domain: `vue-ext` })" required="true" revealable="true"/>

            <ext-passwordfield :errorTarget="errorTarget" :label="l10n(`Confirm password`, { domain: `vue-ext` })" labelAlign="left" labelWidth="150" name="confirmedPassword" :placeholder="l10n(`Confirm password`, { domain: `vue-ext` })" required="true" revealable="true"/>

            <ext-container layout="center">
                <ext-button :text="l10n(`Generate random password`, { domain: `vue-ext` })" @tap="_generatePassword"/>
            </ext-container>

            <ext-togglefield :label="l10n(`Access enabled`, { domain: `vue-ext` })" labelAlign="left" labelWidth="150" name="enabled" value="true"/>
        </ext-fieldpanel>

        <RolesPanel ref="rolesPanel" :aclId="aclId" flex="1"/>

        <ext-toolbar docked="bottom">
            <ext-spacer/>
            <ext-button :text="l10n(`Create user`, { domain: `vue-ext` })" ui="action" @tap="_submit"/>
        </ext-toolbar>
    </ext-dialog>
</template>

<script>
import constants from "#core/app/constants";
import passwords from "#core/utils/passwords";
import RolesPanel from "#src/components/acl/roles.panel";

export default {
    "components": { RolesPanel },

    "props": {
        "errorTarget": {
            "type": String,
            "default": "under",
        },
    },

    "emits": ["created"],

    data () {
        return {
            "aclId": constants.mainAclId,
        };
    },

    "methods": {

        // protected
        async _ready ( e ) {
            this.ext = e.detail.cmp;

            this.$refs.form.ext.getFields( "password" ).setValidators( {
                "type": "password-strength",
                "strength": this.$app.settings.passwordsStrength,
            } );
        },

        _onFormReady ( e ) {
            var cmp = e.detail.cmp;

            cmp.setKeyMap( { "ENTER": { "handler": "submit", "scope": this } } );
        },

        _generatePassword () {
            const password = passwords.generatePassword().password;

            this.$utils.copyToClipboard( password );

            this.$utils.toast( this.l10n( `Password copied to the clipboard`, { "domain": `vue-ext` } ) );

            this.$refs.form.ext.getFields( "password" ).setValue( password );
            this.$refs.form.ext.getFields( "confirmedPassword" ).setValue( password );
        },

        async _submit () {
            const form = this.$refs.form.ext;

            if ( !form.validate() ) return;

            const values = form.getValues();

            if ( values.password !== values.confirmedPassword ) {
                form.getFields( "confirmedPassword" ).setError( this.l10n( "Passwords do not match", { "domain": "vue-ext" } ) );

                return;
            }

            const email = values.email;
            delete values.email;

            delete values.confirmedPassword;

            const res = await this.$api.call( "administration/users/create", email, values, this.$refs.rolesPanel.getEnabledRoles() );

            if ( res.ok ) {
                this.$utils.toast( this.l10n( "User created", { "domain": `vue-ext` } ) );

                this.$emit( "created" );

                this.ext.close();
            }
            else {
                this.$utils.toast( res );
            }
        },
    },
};
</script>

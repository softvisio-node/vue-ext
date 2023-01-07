<template>
    <ext-dialog closeAction="destroy" height="90%" layout="vbox" scrollable="true" :title="i18nd(`vue-ext`, `User creation`)" width="600" @ready="_onReady">
        <ext-fieldpanel ref="form" @ready="_onFormReady">
            <ext-emailfield :errorTarget="errorTarget" :label="i18nd(`vue-ext`, `Email`)" labelAlign="left" labelWidth="150" name="email" :placeholder="i18nd(`vue-ext`, `Enter email`)" required="true" validators="email"/>

            <ext-passwordfield :errorTarget="errorTarget" :label="i18nd(`vue-ext`, `Password`)" labelAlign="left" labelWidth="150" name="password" :placeholder="i18nd(`vue-ext`, `Enter password`)" required="true" revealable="true"/>

            <ext-passwordfield :errorTarget="errorTarget" :label="i18nd(`vue-ext`, `Confirm password`)" labelAlign="left" labelWidth="150" name="confirmedPassword" :placeholder="i18nd(`vue-ext`, `Confirm password`)" required="true" revealable="true"/>

            <ext-container layout="center">
                <ext-button :text="i18nd(`vue-ext`, `Generate random password`)" @tap="_generatePassword"/>
            </ext-container>

            <ext-togglefield :label="i18nd(`vue-ext`, `Access enabled`)" labelAlign="left" labelWidth="150" name="enabled" value="true"/>
        </ext-fieldpanel>

        <RolesPanel ref="rolesPanel" :aclId="aclId" flex="1"/>

        <ext-toolbar docked="bottom">
            <ext-spacer/>
            <ext-button :text="i18nd(`vue-ext`, `Create user`)" ui="action" @tap="_submit"/>
        </ext-toolbar>
    </ext-dialog>
</template>

<script>
import constants from "#core/app/constants";
import passwords from "#core/utils/passwords";
import RolesPanel from "#lib/components/acl/roles.panel";

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
            "aclId": constants.defaultAclId,
        };
    },

    "methods": {

        // public
        close () {
            this.ext.destroy();
        },

        // protected
        async _onReady ( e ) {
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

            this.$utils.toast( this.i18nd( `vue-ext`, `Password copied to the clipboard` ) );

            this.$refs.form.ext.getFields( "password" ).setValue( password );
            this.$refs.form.ext.getFields( "confirmedPassword" ).setValue( password );
        },

        async _submit () {
            const form = this.$refs.form.ext;

            if ( !form.validate() ) return;

            const values = form.getValues();

            if ( values.password !== values.confirmedPassword ) {
                form.getFields( "confirmedPassword" ).setError( this.i18nd( "vue-ext", "Passwords do not match" ) );

                return;
            }

            delete values.confirmedPassword;

            values.roles = this.$refs.rolesPanel.getEnabledRoles();

            const res = await this.$api.call( "admin/users/create", values );

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

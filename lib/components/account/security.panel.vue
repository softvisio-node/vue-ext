<template>
    <ext-container layout="vbox" viewModel="true">
        <!-- email email -->
        <ext-container ref="emailContainer" defaults='{"labelAlign":"left","labelWidth":200}' layout="hbox">
            <ext-displayfield :label="i18nd(`vue-ext`, `Email address`)" value="dzagashev@gmail.com"/>
            <ext-button :text="i18nd(`vue-ext`, `Change`)" @tap="_editEmail"/>
        </ext-container>

        <ext-container ref="editEmailContainer" defaults='{"labelAlign":"left","labelWidth":200}' :hidden="true" layout="hbox">
            <ext-emailfield ref="emailField" :label="i18nd(`vue-ext`, `Primary email address`)" value="dzagashev@gmail.com"/>
            <ext-button iconCls="fa-solid fa-xmark" :text="i18nd(`vue-ext`, `Cancel`)" @tap="_cancelEditEmail"/>
            <ext-button iconCls="fa-solid fa-check" :text="i18nd(`vue-ext`, `Save`)" @tap="_setEmail"/>
        </ext-container>

        <!-- password -->
        <ext-panel>
            <ext-toolbar docked="top">
                <ext-container :html="i18nd(`vue-ext`, `Password change`)"/>
            </ext-toolbar>

            <ext-fieldpanel ref="changePasswordForm" defaults='{"labelAlign":"left","labelWidth":200}'>
                <ext-passwordfield :label="i18nd(`vue-ext`, `New password`)" name="password" required="true"/>
                <ext-passwordfield ref="passwordConfirm" :label="i18nd(`vue-ext`, `Confirm new password`)" required="true"/>
            </ext-fieldpanel>

            <ext-container layout='{"pack":"end","type":"hbox"}'>
                <ext-button :text="i18nd(`vue-ext`, `Change password`)" @tap="changePassword"/>
            </ext-container>
        </ext-panel>

        <!-- active sessions -->
        <UserSessionsPanel height="100%" maxHeight="400" minHeight="200"/>
    </ext-container>
</template>

<script>
import UserSessionsPanel from "#lib/components/user-sessions/panel";

export default {
    "components": { UserSessionsPanel },

    "methods": {
        _editEmail () {
            this.$refs.emailContainer.ext.hide();

            this.$refs.editEmailContainer.ext.show();
        },

        _cancelEditEmail () {
            this.$refs.emailContainer.ext.show();

            this.$refs.editEmailContainer.ext.hide();
        },

        async _setEmail () {
            const email = this.$refs.emailField.ext.getValue();

            this.$refs.editEmailContainer.ext.mask();

            const res = await this.$api.call( "account/set-email", email );

            this.$refs.editEmailContainer.ext.unmask();

            if ( res.ok ) {
                this.$utils.toast( res );

                this._cancelEditEmail();
            }
            else {
                this.$utils.toast( res );

                this._cancelEditEmail();
            }
        },

        async reload () {
            const res = await this.$api.call( "account/get-account" );

            if ( !res.ok ) {
                this.$utils.toast( res );
            }
        },

        async changePassword () {
            var form = this.$refs.changePasswordForm.ext,
                passwordCondirm = this.$refs.passwordConfirm.ext;

            if ( !form.validate() ) return;

            var vals = form.getValues();

            if ( vals.password !== passwordCondirm.getValue() ) {
                passwordCondirm.setError( "Passwords are not match" );

                return;
            }

            Ext.Viewport.mask();

            const res = await this.$store.session.setPassword( vals.password );

            Ext.Viewport.unmask();

            if ( res.ok ) {
                form.reset( true );

                this.$utils.toast( this.i18nd( `vue-ext`, "Password changed" ) );
            }
            else {
                this.$utils.toast( res );
            }
        },
    },
};
</script>

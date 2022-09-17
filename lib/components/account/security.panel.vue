<template>
    <ext-container layout="vbox" padding="0 10 0 10" scrollable="true" viewModel="true" @ready="_ready">
        <!-- email  -->
        <ext-container ref="emailContainer" defaults='{"labelAlign":"left","labelWidth":200}' layout='{"align":"center","type":"hbox"}'>
            <ext-displayfield bind="{record.email}" :label="i18nd(`vue-ext`, `Email address`)" padding="0 10 0 0"/>

            <ext-button bind='{"hidden":"{!record.email_confirmed}"}' iconCls="fa-solid fa-check" :tooltip="i18nd(`vue-ext`, `Email address confirmed`)"/>
            <ext-button bind='{"hidden":"{record.email_confirmed}"}' :text="i18nd(`vue-ext`, `Confirm email`)" @tap="_confirmEmail"/>

            <ext-button :text="i18nd(`vue-ext`, `Change`)" @tap="_editEmail"/>
        </ext-container>

        <!-- edit email -->
        <ext-fieldpanel ref="editEmailContainer" defaults='{"labelAlign":"left","labelWidth":200}' :hidden="true" layout='{"align":"center","type":"hbox"}'>
            <ext-emailfield bind="{record.email}" :label="i18nd(`vue-ext`, `Email address`)" padding="0 10 0 0" required="true" validators="email"/>

            <ext-button iconCls="fa-solid fa-xmark" :text="i18nd(`vue-ext`, `Cancel`)" @tap="_cancelEditEmail"/>
            <ext-button iconCls="fa-solid fa-check" :text="i18nd(`vue-ext`, `Save`)" @tap="_setEmail"/>
        </ext-fieldpanel>

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
                <ext-button :text="i18nd(`vue-ext`, `Change password`)" @tap="_setPassword"/>
            </ext-container>
        </ext-panel>

        <!-- sessions -->
        <UserSessionsPanel maxHeight="500" minHeight="300"/>
    </ext-container>
</template>

<script>
import UserSessionsPanel from "#lib/components/user-sessions/panel";
import AccountModel from "./models/account";

export default {
    "components": { UserSessionsPanel },

    "methods": {
        _ready ( e ) {
            this.ext = e.detail.cmp;

            this.reload();
        },

        _editEmail () {
            this.$refs.emailContainer.ext.hide();

            this.$refs.editEmailContainer.ext.show();
        },

        _cancelEditEmail () {
            this.ext.getViewModel().get( "record" ).reject();

            this.$refs.emailContainer.ext.show();

            this.$refs.editEmailContainer.ext.hide();
        },

        async _setEmail () {
            const record = this.ext.getViewModel().get( "record" ),
                form = this.$refs.editEmailContainer.ext;

            if ( !form.validate() ) return;

            if ( !record.isModified( "email" ) ) {
                this._cancelEditEmail();

                return;
            }

            this.$refs.editEmailContainer.ext.mask();

            const res = await this.$api.call( "account/set-email", record.get( "email" ) );

            this.$refs.editEmailContainer.ext.unmask();

            if ( res.ok ) {
                this.$utils.toast( res );

                this.ext.getViewModel().get( "record" ).commit( false, "email" );

                this._cancelEditEmail();
            }
            else {
                this.$utils.toast( res );
            }
        },

        async _confirmEmail ( e ) {
            const button = e.detail.sender;

            button.disable();

            const res = await this.$api.call( "session/send-confirmation-email" );

            button.enable();

            if ( res.ok ) {
                this.$utils.toast( this.i18nd( `vue-ext`, `Confirmation email sent` ) );
            }
            else {
                this.$utils.toast( res );
            }
        },

        async reload () {
            const res = await this.$api.call( "account/get-account" );

            if ( !res.ok ) {
                this.$utils.toast( res );
            }
            else {
                const record = new AccountModel( res.data );

                this.ext.getViewModel().set( "record", record );
            }
        },

        async _setPassword () {
            const form = this.$refs.changePasswordForm.ext,
                passwordCondirm = this.$refs.passwordConfirm.ext;

            if ( !form.validate() ) return;

            const values = form.getValues();

            if ( values.password !== passwordCondirm.getValue() ) {
                passwordCondirm.setError( "Passwords are not match" );

                return;
            }

            Ext.Viewport.mask();

            const res = await this.$store.session.setPassword( values.password );

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

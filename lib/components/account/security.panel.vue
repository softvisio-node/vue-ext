<template>
    <ext-container layout="vbox" padding="0 10 0 10" scrollable="true" viewModel="true" @ready="_ready">
        <!-- password -->
        <ext-fieldcontainer :label="i18nd(`vue-ext`, `Password`)" labelAlign="left" labelWidth="200" layout='{"align":"center","type":"hbox"}'>
            <ext-button :text="i18nd(`vue-ext`, `Change password`)" @tap="_changePassword"/>
        </ext-fieldcontainer>

        <!-- telegram username -->
        <ext-fieldcontainer bind='{"hidden":"{!record.telegram_enabled}"}' :label="i18nd(`vue-ext`, `Telegram username`)" labelAlign="left" labelWidth="200" layout="vbox">
            <ext-container ref="displayTelegramUsernameContainer" layout='{"align":"center","type":"hbox"}'>
                <ext-displayfield bind="{record.telegram_username}" width="200"/>
                <ext-button :text="i18nd(`vue-ext`, `Change`)" @tap="_editTelegramUsername"/>
            </ext-container>

            <!-- edit telegram -->
            <ext-container ref="editTelegramUsernameContainer" layout='{"align":"center","type":"hbox"}'>
                <ext-textfield bind="{record.telegram_username}" width="200"/>
                <ext-button iconCls="fa-solid fa-xmark" :text="i18nd(`vue-ext`, `Cancel`)" @tap="_cancelEditTelegramUsername"/>
                <ext-button iconCls="fa-solid fa-check" :text="i18nd(`vue-ext`, `Save`)" @tap="_setTelegramUsername"/>
            </ext-container>

            <!-- connect telegram -->
            <ext-container bind='{"hidden":"{record.telegram_connected}"}' layout='{"align":"start","type":"vbox"}'>
                <ext-container :html='i18n(`vue-ext`, `Telegram bot is not connected. To connect bot open it in telegram and press "Start".`)'/>
                <ext-button iconCls="fa-brands fa-telegram" :text="i18nd(`vue-ext`, `Connect bot`)" @tap="_openTelegramBot"/>
            </ext-container>
        </ext-fieldcontainer>

        <!-- email  -->
        <ext-fieldcontainer :label="i18nd(`vue-ext`, `Email address`)" labelAlign="left" labelWidth="200" layout='{"align":"center","type":"hbox"}'>
            <ext-displayfield bind="{record.email}" width="200"/>

            <!-- confitm email -->
            <ext-button bind='{"hidden":"{!record.email_confirmed}"}' iconCls="fa-solid fa-check" :tooltip="i18nd(`vue-ext`, `Email address confirmed`)"/>
            <ext-button bind='{"hidden":"{record.email_confirmed}"}' :text="i18nd(`vue-ext`, `Confirm`)" @tap="_confirmEmail"/>

            <!-- change email -->
            <ext-button :text="i18nd(`vue-ext`, `Change`)" @tap="_changeEmail"/>
        </ext-fieldcontainer>

        <!-- sessions -->
        <UserSessionsPanel margin="20 0 0 0" maxHeight="500" minHeight="300"/>
    </ext-container>
</template>

<script>
import UserSessionsPanel from "#lib/components/user-sessions/panel";
import AccountModel from "./models/account";
import ChangePasswordDialog from "#lib/components/change-password.dialog";

export default {
    "components": { UserSessionsPanel },

    "methods": {
        _ready ( e ) {
            this.ext = e.detail.cmp;

            this.reload();
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

        // email
        async _changeEmail () {
            const cmp = await this.$mount( ChangePasswordDialog );

            cmp.ext.show();
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

        // telegram
        _editTelegramUsername () {
            this.$refs.displayTelegramUsernameContainer.ext.hide();

            this.$refs.editTelegramUsernameContainer.ext.show();
        },

        _cancelEditTelegramUsername () {
            this.ext.getViewModel().get( "record" ).reject();

            this.$refs.displayTelegramUsernameContainer.ext.show();

            this.$refs.editTelegramUsernameContainer.ext.hide();
        },

        // XXX
        async _setTelegramUsername () {
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

        _openTelegramBot () {
            window.open( this.ext.getViewModel().get( "record" ).get( "telegram_bot_url" ), "_blank" ).focus();
        },

        // password
        async _changePassword () {
            const cmp = await this.$mount( ChangePasswordDialog );

            cmp.ext.show();
        },
    },
};
</script>

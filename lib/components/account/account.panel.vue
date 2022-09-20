<template>
    <ext-container layout="vbox" padding="0 10 0 10" scrollable="true" viewModel="true" @ready="_ready">
        <!-- locale -->
        <ext-fieldcontainer container='{"defaults":null}' :hidden="localeHidden" :label="i18nd(`vue-ext`, `Locale`)" labelAlign="left" labelWidth="200" layout='{"align":"center","type":"hbox"}'>
            <LocaleButton/>
        </ext-fieldcontainer>

        <!-- password -->
        <ext-fieldcontainer container='{"defaults":null}' :label="i18nd(`vue-ext`, `Password`)" labelAlign="left" labelWidth="200" layout='{"align":"center","type":"hbox"}'>
            <ext-button :text="i18nd(`vue-ext`, `Change password`)" @tap="_changePassword"/>
        </ext-fieldcontainer>

        <!-- email  -->
        <ext-fieldcontainer container='{"defaults":null}' :label="i18nd(`vue-ext`, `Email address`)" labelAlign="left" labelWidth="200" layout='{"align":"center","type":"hbox"}'>
            <ext-displayfield bind="{record.email}" width="200"/>

            <!-- change email -->
            <ext-button :text="i18nd(`vue-ext`, `Change`)" @tap="_changeEmail"/>

            <!-- confitm email -->
            <ext-button bind='{"hidden":"{record.email_confirmed}"}' :text="i18nd(`vue-ext`, `Confirm`)" @tap="_confirmEmail"/>
        </ext-fieldcontainer>

        <!-- telegram username -->
        <ext-fieldcontainer bind='{"hidden":"{!record.telegram_enabled}"}' container='{"defaults":null}' :label="i18nd(`vue-ext`, `Telegram username`)" labelAlign="left" labelWidth="200" layout='{"align":"center","type":"hbox"}'>
            <ext-container ref="displayTelegramUsernameContainer" layout='{"align":"center","type":"hbox"}'>
                <ext-displayfield bind="{record.telegram_username}" width="200"/>
                <ext-button :text="i18nd(`vue-ext`, `Change`)" @tap="_editTelegramUsername"/>
                <ext-button bind='{"hidden":"{!record.has_telegram_username || !record.telegram_connected}"}' iconCls="fa-brands fa-telegram" :text="i18nd(`vue-ext`, `Open bot`)" @tap="_openTelegramBot"/>
                <ext-button bind='{"hidden":"{!record.has_telegram_username || record.telegram_connected}"}' iconCls="fa-brands fa-telegram" :text="i18nd(`vue-ext`, `Connect bot`)" ui="decline" @tap="_openTelegramBot"/>
            </ext-container>

            <!-- edit telegram -->
            <ext-container ref="editTelegramUsernameContainer" :hidden="true" layout='{"align":"center","type":"hbox"}'>
                <ext-textfield ref="telegramUsernameField" bind="{record.telegram_username}" width="200"/>
                <ext-button iconCls="fa-solid fa-xmark" :text="i18nd(`vue-ext`, `Cancel`)" @tap="_cancelEditTelegramUsername"/>
                <ext-button iconCls="fa-solid fa-check" :text="i18nd(`vue-ext`, `Save`)" ui="action" @tap="_setTelegramUsername"/>
            </ext-container>
        </ext-fieldcontainer>

        <!-- sessions -->
        <UserSessionsPanel margin="20 0 0 0" maxHeight="500" minHeight="300"/>
    </ext-container>
</template>

<script>
import locale from "#vue/locale";
import UserSessionsPanel from "#lib/components/user-sessions/panel";
import AccountModel from "./models/account";
import ChangePasswordDialog from "#lib/components/change-password.dialog";
import ChangeEmailDialog from "#lib/components/change-email.dialog";
import LocaleButton from "#lib/components/locale.button";

export default {
    "components": { LocaleButton, UserSessionsPanel },

    "computed": {
        localeHidden () {
            return !locale.hasLocales;
        },
    },

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
            const cmp = await this.$mount( ChangeEmailDialog );

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

        async _setTelegramUsername () {
            const record = this.ext.getViewModel().get( "record" );

            if ( !this.$refs.telegramUsernameField.ext.validate() ) return;

            if ( !record.isModified( "telegram_username" ) ) {
                this._cancelEditTelegramUsername();

                return;
            }

            this.$refs.editTelegramUsernameContainer.ext.mask();

            const res = await this.$api.call( "account/set-telegram-username", record.get( "telegram_username" ) );

            this.$refs.editTelegramUsernameContainer.ext.unmask();

            if ( res.ok ) {
                this.$utils.toast( res );

                record.commit( false, "telegram_username" );

                this._cancelEditTelegramUsername();
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

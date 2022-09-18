<template>
    <ext-container layout="vbox" padding="0 10 0 10" scrollable="true" viewModel="true" @ready="_ready">
        <!-- password -->
        <ext-container layout='{"align":"center","type":"hbox"}'>
            <ext-displayfield :label="i18nd(`vue-ext`, `Password`)" labelAlign="left" labelWidth="200"/>

            <ext-button :text="i18nd(`vue-ext`, `Change password`)" @tap="_changePassword"/>
        </ext-container>

        <!-- telegram username -->
        <ext-container ref="telegramContainer" layout='{"align":"center","type":"hbox"}'>
            <ext-displayfield bind="{record.telegram_username}" :label="i18nd(`vue-ext`, `Telegram username`)" labelAlign="left" labelWidth="200" padding="0 10 0 0"/>

            <ext-button bind='{"hidden":"{!record.telegram_connected}"}' iconCls="fa-solid fa-check" :tooltip="i18nd(`vue-ext`, `Telegram bot connected`)"/>
            <ext-button bind='{"hidden":"{record.telegram_connected}"}' :text="i18nd(`vue-ext`, `Confirm email`)" @tap="_confirmEmail"/>

            <ext-button :text="i18nd(`vue-ext`, `Change`)" @tap="_editEmail"/>
        </ext-container>

        <ext-container :html='i18n(`vue-ext`, `Telegram bot is not connected. To connect bot open it in telegram and press "Start".`)'/>

        <!-- edit telegram username -->
        <ext-fieldpanel ref="editTelegramUsernameContainer" :hidden="true" layout='{"align":"center","type":"hbox"}'>
            <ext-emailfield bind="{record.email}" :label="i18nd(`vue-ext`, `Email address`)" labelAlign="left" labelWidth="200" padding="0 10 0 0" required="true" validators="email"/>

            <ext-button iconCls="fa-solid fa-xmark" :text="i18nd(`vue-ext`, `Cancel`)" @tap="_cancelEditEmail"/>
            <ext-button iconCls="fa-solid fa-check" :text="i18nd(`vue-ext`, `Save`)" @tap="_setEmail"/>
        </ext-fieldpanel>

        <!-- email  -->
        <ext-container ref="emailContainer" layout='{"align":"center","type":"hbox"}'>
            <ext-displayfield bind="{record.email}" :label="i18nd(`vue-ext`, `Email address`)" labelAlign="left" labelWidth="200" padding="0 10 0 0"/>

            <ext-button bind='{"hidden":"{!record.email_confirmed}"}' iconCls="fa-solid fa-check" :tooltip="i18nd(`vue-ext`, `Email address confirmed`)"/>
            <ext-button bind='{"hidden":"{record.email_confirmed}"}' :text="i18nd(`vue-ext`, `Confirm email`)" @tap="_confirmEmail"/>

            <ext-button :text="i18nd(`vue-ext`, `Change`)" @tap="_editEmail"/>
        </ext-container>

        <!-- edit email -->
        <ext-fieldpanel ref="editEmailContainer" :hidden="true" layout='{"align":"center","type":"hbox"}'>
            <ext-emailfield bind="{record.email}" :label="i18nd(`vue-ext`, `Email address`)" labelAlign="left" labelWidth="200" padding="0 10 0 0" required="true" validators="email"/>

            <ext-button iconCls="fa-solid fa-xmark" :text="i18nd(`vue-ext`, `Cancel`)" @tap="_cancelEditEmail"/>
            <ext-button iconCls="fa-solid fa-check" :text="i18nd(`vue-ext`, `Save`)" @tap="_setEmail"/>
        </ext-fieldpanel>

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

        async _changePassword () {
            const cmp = await this.$mount( ChangePasswordDialog );

            cmp.ext.show();
        },
    },
};
</script>

<template>
    <CardsPanel ref="cards" @refresh="refresh">
        <template #data>
            <ext-container ref="dataCard" layout="vbox" padding="0 10 0 10" scrollable="true" viewModel="true" @ready="_ready">
                <!-- locale -->
                <ext-fieldcontainer container='{"defaults":null}' :hidden="localeHidden" :label="l10nd(`vue-ext`, `Locale`)" labelAlign="left" labelWidth="200" layout='{"align":"center","type":"hbox"}'>
                    <LocaleButton/>
                </ext-fieldcontainer>

                <!-- password -->
                <ext-fieldcontainer container='{"defaults":null}' :label="l10nd(`vue-ext`, `Password`)" labelAlign="left" labelWidth="200" layout='{"align":"center","type":"hbox"}'>
                    <ext-button :text="l10nd(`vue-ext`, `Change password`)" @tap="_changePassword"/>
                </ext-fieldcontainer>

                <!-- email  -->
                <ext-fieldcontainer container='{"defaults":null}' :label="l10nd(`vue-ext`, `Email address`)" labelAlign="left" labelWidth="200" layout='{"align":"center","type":"hbox"}'>
                    <ext-displayfield bind="{record.email}" width="200"/>

                    <!-- change email -->
                    <ext-button :text="l10nd(`vue-ext`, `Change`)" @tap="_changeEmail"/>

                    <!-- confitm email -->
                    <ext-button bind='{"hidden":"{record.email_confirmed}"}' :text="l10nd(`vue-ext`, `Confirm`)" @tap="_confirmEmail"/>
                </ext-fieldcontainer>

                <!-- sessions -->
                <UserSessionsPanel margin="20 0 0 0" maxHeight="500" minHeight="300"/>
            </ext-container>
        </template>
    </CardsPanel>
</template>

<script>
import CardsPanel from "#src/components/cards.panel";
import UserSessionsPanel from "#src/components/user-sessions/panel";
import AccountModel from "./models/account";
import ChangePasswordDialog from "#src/components/change-password.dialog";
import ChangeEmailDialog from "#src/components/change-email.dialog";
import LocaleButton from "#src/components/locale.button";

export default {
    "components": { CardsPanel, LocaleButton, UserSessionsPanel },

    "computed": {
        localeHidden () {
            return !this.$app.locale.canChangeLocale;
        },
    },

    "methods": {
        _ready ( e ) {
            this.ext = e.detail.cmp;
        },

        async refresh () {
            const res = await this.$api.call( "account/get-account" );

            this.$refs.cards.setResult( res );

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
                this.$utils.toast( this.l10nd( `vue-ext`, `Confirmation email sent` ) );
            }
            else {
                this.$utils.toast( res );
            }
        },

        // password
        async _changePassword () {
            const cmp = await this.$mount( ChangePasswordDialog );

            cmp.ext.show();
        },
    },
};
</script>

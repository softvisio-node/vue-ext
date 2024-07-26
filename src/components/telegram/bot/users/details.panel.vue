<template>
    <CardsPanel ref="cardsPanel" viewModel="true" @render="ready">
        <template #dataPanel>
            <ext-panel layput="fit" padding="0 10 0 10">
                <ext-avatar bind="{record.avatar_url}" height="60" width="60"/>

                <ext-displayfield bind="{record.full_name}" :label="l10n(`Name`)" labelAlign="left" labelWidth="200"/>

                <ext-container layout='{"align":"center","type":"hbox"}'>
                    <ext-displayfield bind="{record.username}" :label="l10n(`Bot username`)" labelAlign="left" labelWidth="200"/>
                    <ext-spacer/>

                    <ext-button iconCls="fa-regular fa-copy" :text="l10n(`Copy`)" @tap="_copyUssername"/>
                </ext-container>

                <ext-displayfield bind="{record.is_bot}" :label="l10n(`Is bot`)" labelAlign="left" labelWidth="200"/>

                <ext-container layout='{"align":"center","type":"hbox"}'>
                    <ext-displayfield bind="{record.phone_text}" :label="l10n(`Phone`)" labelAlign="left" labelWidth="200"/>
                    <ext-spacer/>
                    <ext-button bind='{"hidden":"{!record.phone}"}' iconCls="fa-regular fa-copy" :tooltip="l10n(`Copy to the clipboard`)" @tap="_copyPhone"/>
                </ext-container>

                <ext-displayfield bind="{record.created_text}" :label="l10n(`Creation date`)" labelAlign="left" labelWidth="200"/>

                <ext-displayfield bind="{record.last_activity_text}" :label="l10n(`Last activity date`)" labelAlign="left" labelWidth="200"/>

                <ext-displayfield bind="{record.subscription_status}" :label="l10n(`Subscription status`)" labelAlign="left" labelWidth="200"/>

                <ext-displayfield bind="{record.enabled_status}" :label="l10n(`Enabled`)" labelAlign="left" labelWidth="200"/>
                <ext-container layout='{"align":"center","type":"hbox"}'>
                    <ext-spacer width="200"/>
                    <ext-button bind='{"hidden":"{disableButtonHidden}"}' :text="l10n(`Disable user`)" ui="decline" @tap="toggleUserEnabled"/>
                    <ext-button bind='{"hidden":"{enableButtonHidden}"}' :text="l10n(`Enable user`)" @tap="toggleUserEnabled"/>
                </ext-container>
                <ext-spacer height="10"/>

                <ext-container bind='{"hidden":"{!record.api_user_id}"}' layout="hbox">
                    <ext-displayfield :label="l10n(`Linked API user`)" labelAlign="left" labelWidth="200"/>

                    <ext-avatar bind="{record.api_user_avatar_url}"/>

                    <ext-spacer width="5"/>

                    <ext-displayfield bind="{record.api_user_email}"/>
                </ext-container>
            </ext-panel>
        </template>
    </CardsPanel>
</template>

<script>
import CardsPanel from "#src/components/cards.panel";

export default {
    "components": { CardsPanel },

    "props": {
        "telegramBotRecord": {
            "type": Object,
            "required": true,
        },
        "telegramBotUserRecord": {
            "type": Object,
            "required": true,
        },
    },

    "methods": {
        ready () {
            this.$refs.cardsPanel.ext.getViewModel().set( "telegramBotRecord", this.telegramBotRecord );

            this.$refs.cardsPanel.ext.getViewModel().setFormulas( {
                "disableButtonHidden": {
                    "bind": {
                        "permissions": "{telegramBotRecord.acl_user_permissions}",
                        "enabled": "{record.enabled}",
                    },
                    get ( data ) {
                        if ( !data.permissions.has( "telegram/bot/users:update" ) ) return true;

                        return !data.enabled;
                    },
                },

                "enableButtonHidden": {
                    "bind": {
                        "permissions": "{telegramBotRecord.acl_user_permissions}",
                        "enabled": "{record.enabled}",
                    },
                    get ( data ) {
                        if ( !data.permissions.has( "telegram/bot/users:update" ) ) return true;

                        return data.enabled;
                    },
                },
            } );

            this._onRecordChange();
        },

        _onRecordChange () {
            this.$refs.cardsPanel.ext.getViewModel().set( "record", this.telegramBotUserRecord );

            if ( this.telegramBotUserRecord ) {
                this.$refs.cardsPanel.showDataPanel();
            }
            else {
                this.$refs.cardsPanel.showNoDataPanel();
            }
        },

        async toggleUserEnabled () {
            const record = this.telegramBotUserRecord,
                enabled = !record.get( "enabled" );

            const res = await this.$api.call( "telegram/bots/users/set-user-enabled", record.get( "telegram_bot_id" ), record.id, enabled );

            if ( !res.ok ) {
                this.$toast( res );
            }
            else {
                record.set( "enabled", enabled );
            }
        },

        _copyUssername () {
            this.$utils.copyToClipboard( this.telegramBotUserRecord.get( "username" ) );

            this.$toast( l10n( "Username copied to the clipboard" ) );
        },

        _copyPhone () {
            if ( !this.telegramBotUserRecord.get( "phone" ) ) return;

            this.$utils.copyToClipboard( this.telegramBotUserRecord.get( "phone" ) );

            this.$toast( l10n( "Username copied to the clipboard" ) );
        },
    },
};
</script>

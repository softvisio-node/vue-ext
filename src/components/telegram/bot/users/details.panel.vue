<template>
    <CardsPanel ref="cardsPanel" viewModel="true" @render="ready">
        <template #dataPanel>
            <ext-panel layput="fit" padding="0 10 0 10">
                <ext-avatar bind="{record.avatar_url}" height="60" width="60"/>

                <ext-displayfield bind="{record.full_name}" :label="l10n(`Name`)" labelAlign="left" labelWidth="200"/>

                <ext-container layout='{"align":"center","type":"hbox"}'>
                    <ext-displayfield bind="{record.username}" :label="l10n(`Telegram username`)" labelAlign="left" labelWidth="200"/>
                    <ext-spacer/>

                    <ext-button iconCls="fa-regular fa-copy" :tooltip="l10n(`Copy to the clipboard`)" @tap="_copyUssername"/>
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

                <ext-container layout='{"align":"center","type":"hbox"}'>
                    <ext-displayfield bind="{record.ban_status}" :label="l10n(`Ban status`)" labelAlign="left" labelWidth="200"/>

                    <ext-spacer/>

                    <ext-button bind='{"hidden":"{banButtonHidden}"}' :text="l10n(`Ban user`)" ui="decline" @tap="toggjeUserBanned"/>

                    <ext-button bind='{"hidden":"{unbanButtonHidden}"}' :text="l10n(`Unban user`)" @tap="toggjeUserBanned"/>
                </ext-container>

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
                "banButtonHidden": {
                    "bind": {
                        "permissions": "{telegramBotRecord.acl_user_permissions}",
                        "banned": "{record.banned}",
                    },
                    get ( data ) {
                        if ( !data.permissions.has( "telegram/bot/users:update" ) ) return true;

                        return data.banned;
                    },
                },

                "unbanButtonHidden": {
                    "bind": {
                        "permissions": "{telegramBotRecord.acl_user_permissions}",
                        "banned": "{record.banned}",
                    },
                    get ( data ) {
                        if ( !data.permissions.has( "telegram/bot/users:update" ) ) return true;

                        return !data.banned;
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

        async toggjeUserBanned () {
            const record = this.telegramBotUserRecord,
                banned = !record.get( "banned" );

            const res = await this.$api.call( "telegram/bots/users/set-user-banned", record.get( "telegram_bot_id" ), record.id, banned );

            if ( !res.ok ) {
                this.$toast( res );
            }
            else {
                record.set( "banned", banned );
            }
        },

        _copyUssername () {
            this.$utils.copyToClipboard( this.telegramBotUserRecord.get( "username" ) );

            this.$toast( this.l10n( "Username copied to the clipboard" ) );
        },

        _copyPhone () {
            if ( !this.telegramBotUserRecord.get( "phone" ) ) return;

            this.$utils.copyToClipboard( this.telegramBotUserRecord.get( "phone" ) );

            this.$toast( this.l10n( "Username copied to the clipboard" ) );
        },
    },
};
</script>

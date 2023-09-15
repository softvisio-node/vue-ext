<template>
    <CardsPanel ref="cardsPanel" @ready="ready">
        <template #data>
            <ext-panel ref="dataPanel" layout="fit" viewModel="true">
                <ext-toolbar docked="top">
                    <ext-spacer/>
                    <ext-button iconCls="fa-solid fa-redo" :text="l10n(`Refresh`)" @tap="refresh"/>
                </ext-toolbar>

                <ext-panel padding="10 10 10 10" scrollable="true">
                    <ext-displayfield bind="{record.telegram_username}" :label="l10n(`Telegram username`)" labelAlign="left" labelWidth="200"/>

                    <ext-container layout="hbox">
                        <ext-displayfield bind="{record.url}" :label="l10n(`Telegram bot url`)" labelAlign="left" labelWidth="200"/>
                        <ext-spacer/>
                        <ext-button iconCls="fa-regular fa-copy" :tooltip="l10n(`Copy to the clipboard`)" @tap="_copyBotUrl"/>
                        <ext-button iconCls="fa-solid fa-arrow-up-right-from-square" :tooltip="l10n(`Open bot in Tekegram`)" @tap="_openBotUrl"/>
                    </ext-container>

                    <ext-container layout="hbox">
                        <ext-displayfield bind="{record.name}" :label="l10n(`Bot name`)" labelAlign="left" labelWidth="200"/>

                        <ext-spacer/>
                    </ext-container>

                    <ext-displayfield bind="{record.short_description}" :label="l10n(`Short description`)" labelAlign="left" labelWidth="200"/>

                    <!-- <ext-displayfield bind="{record.type}" :label="l10n( `Type` )"/> -->

                    <!-- <ext-displayfield bind="{record.static}" :label="l10n( `Static` )"/> -->

                    <!-- <ext-displayfield bind="{record.created}" :label="l10n( `Creation date` )" renderer="Ext.util.Format.dateRenderer('dateStyle:short,timeStyle:short')"/> -->

                    <!-- status -->
                    <ext-displayfield bind="{record.status_text}" :label="l10n(`Status`)" labelAlign="left" labelWidth="200"/>
                    <ext-displayfield bind='{"hidden":"{!record.error}","value":"{record.error_text}"}' labelAlign="left" labelWidth="200"/>

                    <!-- users stats -->
                    <ext-displayfield bind="{record.last_user_created_text}" :label="l10n(`Last new user subscribed`)" labelAlign="left" labelWidth="200"/>

                    <ext-fieldset layout="hbox" title="Users statistics">
                        <ext-container defaults='{"labelAlign":"left","labelWidth":200}' flex="1" layout="vbox">
                            <ext-displayfield bind="{record.total_users}" :label="l10n(`Total users`)"/>
                            <ext-displayfield bind="{record.total_subscribed_users_text}" :label="l10n(`Total subscribed users`)"/>
                            <ext-displayfield bind="{record.total_unsubscribed_users_text}" :label="l10n(`Total unsubscribed users`)"/>
                        </ext-container>

                        <ext-container defaults='{"labelAlign":"left","labelWidth":200}' layout="vbox">
                            <ext-displayfield bind="{record.total_returned_users}" :label="l10n(`Total returned users`)"/>
                            <ext-displayfield bind="{record.total_banned_users}" :label="l10n(`Total banned users`)"/>
                        </ext-container>
                    </ext-fieldset>

                    <ext-container defaults='{"ui":"decline","width":200}' layout='{"align":"center","type":"vbox"}'>
                        <!-- start -->
                        <ext-button bind='{"hidden":"{!record.can_start}"}' iconCls="fa-regular fa-circle-play" :text="l10n(`Start bot`)" @tap="_startBot"/>

                        <!-- stop -->
                        <ext-button bind='{"hidden":"{!record.can_stop}"}' iconCls="fa-regular fa-circle-stop" :text="l10n(`Stop bot`)" @tap="_stopBot"/>

                        <!-- change api key -->
                        <ext-button bind='{"hidden":"{!record.can_change_api_key}"}' iconCls="fa-solid fa-trash-alt" :text="l10n(`Change bot API key`)" @tap="_deleteBot"/>

                        <!-- delete bot -->
                        <ext-button bind='{"hidden":"{!record.can_delete}"}' iconCls="fa-solid fa-trash-alt" :text="l10n(`Delete bot`)" @tap="_deleteBot"/>
                    </ext-container>
                </ext-panel>
            </ext-panel>
        </template>
    </CardsPanel>
</template>

<script>
import CardsPanel from "#src/components/cards.panel";

export default {
    "components": { CardsPanel },

    "props": {
        "telegramBotLinkRecord": {
            "type": Object,
            "default": null,
        },
    },

    "watch": {
        telegramBotLinkRecord ( newValue, oldValue ) {
            this._onRecordChange();
        },
    },

    "methods": {
        ready ( e ) {
            this._onRecordChange();
        },

        // protected
        _onRecordChange () {
            this.$refs.dataPanel.ext.getViewModel().set( "record", this.telegramBotLinkRecord );

            if ( this.telegramBotLinkRecord ) {
                this.$refs.cardsPanel.showDataPanel();
            }
            else {
                this.$refs.cardsPanel.showNoDataPanel();
            }
        },

        // XXX
        async _deleteLink ( e ) {
            if ( !( await this.$utils.confirm( this.l10n( "Are you sure you want to delete this bot and all it's data? This operation is not revertable." ) ) ) ) return;

            const record = this.record,
                button = e.detail.sender;

            button.disable();

            const res = await this.$api.call( "telegram/bots/delete-bot", record.id );

            button.enable();

            if ( res.ok ) {
                this.refresh();
            }
            else {
                this.$toast( res );
            }
        },

        // XXX
        _copyBotUrl () {
            this.$utils.copyToClipboard( this.record.get( "url" ) );

            this.$toast( this.l10n( "Link copied to the clipboard" ) );
        },
    },
};
</script>

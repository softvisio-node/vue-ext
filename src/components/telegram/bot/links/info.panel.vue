<template>
    <CardsPanel ref="cardsPanel" @ready="ready">
        <template #data>
            <ext-panel ref="dataPanel" layout="fit" viewModel="true">
                <ext-toolbar docked="top">
                    <ext-spacer/>
                    <ext-button iconCls="fa-solid fa-redo" :text="l10n(`Refresh`)" @tap="refresh"/>
                </ext-toolbar>

                <ext-panel padding="10 10 10 10" scrollable="true">
                    <ext-displayfield bind="{record.name}" :label="l10n(`Link name`)" labelAlign="left" labelWidth="200"/>

                    <ext-displayfield bind="{record.description}" :label="l10n(`Link description`)" labelAlign="left" labelWidth="200"/>

                    <ext-displayfield bind="{record.created}" :label="l10n(`Creation date`)" renderer="Ext.util.Format.dateRenderer('dateStyle:short,timeStyle:short')"/>

                    <!-- users stats -->
                    <ext-displayfield bind="{record.last_user_created_text}" :label="l10n(`Last new user subscribed`)" labelAlign="left" labelWidth="200"/>

                    <ext-fieldset defaults='{"labelAlign":"left","labelWidth":200}' layout="vbox" title="Users statistics">
                        <ext-displayfield bind="{record.total_users}" :label="l10n(`Total users`)"/>
                        <ext-displayfield bind="{record.total_subscribed_users_text}" :label="l10n(`Total subscribed users`)"/>
                        <ext-displayfield bind="{record.total_unsubscribed_users_text}" :label="l10n(`Total unsubscribed users`)"/>

                        <ext-displayfield bind="{record.total_returned_users}" :label="l10n(`Total returned users`)"/>
                        <ext-displayfield bind="{record.total_banned_users}" :label="l10n(`Total banned users`)"/>
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

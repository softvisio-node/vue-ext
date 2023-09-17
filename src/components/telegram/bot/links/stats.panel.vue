<template>
    <CardsPanel ref="cardsPanel" @ready="ready">
        <template #data>
            <ext-panel ref="dataPanel" layout="fit" viewModel="true">
                <ext-toolbar docked="top">
                    <ext-spacer/>
                    <ext-button iconCls="fa-solid fa-redo" :text="l10n(`Refresh`)" @tap="refresh"/>
                </ext-toolbar>

                <ext-panel defaults='{"labelAlign":"left","labelWidth":150}' padding="0 0 0 10">
                    <ext-displayfield bind="{record.created_html}" encodeHtml="false" :label="l10n(`Creation date`)"/>

                    <ext-displayfield bind="{record.last_user_created_text}" :label="l10n(`Last user created`)" labelAlign="top"/>

                    <ext-displayfield bind="{record.total_users}" :label="l10n(`Total users`)"/>
                    <ext-displayfield bind="{record.total_subscribed_users_text}" :label="l10n(`Total subscribed users`)"/>
                    <ext-displayfield bind="{record.total_unsubscribed_users_text}" :label="l10n(`Total unsubscribed users`)"/>

                    <ext-displayfield bind="{record.total_returned_users_text}" :label="l10n(`Total returned users`)"/>
                    <ext-displayfield bind="{record.total_banned_users_text}" :label="l10n(`Total banned users`)"/>
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

        async refresh () {
            const res = await this.$api.call( "telegram/bots/links/get-link", this.telegramBotLinkRecord.id );

            if ( res.ok ) {
                this.telegramBotLinkRecord.set( res.data );
            }
            else {
                this.$toast( res );
            }
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
    },
};
</script>

<template>
    <CardsPanel ref="cardsPanel" viewModel="true" @render="ready">
        <template #dataPanel>
            <ext-panel layput="fit" padding="0 10 0 10">
                <ext-avatar bind="{record.avatar_url}" height="60" width="60"/>

                <ext-displayfield bind="{record.full_name}" :label="l10n(`Name`)" labelAlign="left" labelWidth="200"/>

                <ext-displayfield bind="{record.username}" :label="l10n(`Telegram username`)" labelAlign="left" labelWidth="200"/>

                <ext-displayfield bind="{record.is_bot}" :label="l10n(`Is bot`)" labelAlign="left" labelWidth="200"/>

                <ext-displayfield bind="{record.phone_text}" :label="l10n(`Phone`)" labelAlign="left" labelWidth="200"/>

                <ext-displayfield bind="{record.created_text}" :label="l10n(`Creation date`)" labelAlign="left" labelWidth="200"/>

                <ext-displayfield bind="{record.last_activity_text}" :label="l10n(`Last activity date`)" labelAlign="left" labelWidth="200"/>

                <ext-displayfield bind="{record.subscription_status}" :label="l10n(`Subscription status`)" labelAlign="left" labelWidth="200"/>

                <ext-displayfield bind="{record.ban_status}" :label="l10n(`Ban status`)" labelAlign="left" labelWidth="200"/>
            </ext-panel>
        </template>
    </CardsPanel>
</template>

<script>
import CardsPanel from "#src/components/cards.panel";

export default {
    "components": { CardsPanel },

    "props": {
        "telegramBotUserRecord": {
            "type": Object,
            "default": null,
        },
    },

    "watch": {
        telegramBotUserRecord ( newValue, oldValue ) {
            this._onRecordChange();
        },
    },

    "methods": {
        ready () {
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
    },
};
</script>

<template>
    <CardsPanel ref="cardsPanel" viewModel="true" @render="ready">
        <template #dataPanel>
            <ext-panel layput="fit">
                <ext-avatar bind="{record.avatar_url}" height="100" width="100"/>
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

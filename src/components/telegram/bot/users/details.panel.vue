<template>
    <CardsPanel ref="cardsPanel" viewModel="true" @render="ready">
        <ext-panel layput="fit">
            <Avatar bind='{"src":"{record.avatar_url}"}' height="100" width="100"/>
        </ext-panel>
    </CardsPanel>
</template>

<script>
import CardsPanel from "#src/components/cards.panel";
import Avatar from "#src/components/avatar/image";

export default {
    "components": { CardsPanel, Avatar },

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

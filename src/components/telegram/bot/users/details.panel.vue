<template>
    <CardsPanel ref="cardsPanel" @render="ready">
        <template #dataPanel>
            <ext-button text="dddddddddddddddddddddddddd"/>
        </template>
    </CardsPanel>
</template>

<script>
export default {
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
            if ( !this.telegramBotUserRecord ) {
                this.$refs.cardsPanel.showNoDataPanel();
            }
            else {
                this.$refs.cardsPanel.showDataPanel();
            }
        },
    },
};
</script>

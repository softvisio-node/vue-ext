<template>
    <CardsPanel ref="cardsPanel" flex="1" @refresh="refresh">
//
</CardsPanel>
</template>

<script>
import CardsPanel from "#src/components/cards.panel";
import TelegramBotModel from "./models/bot";

export default {
    "components": { CardsPanel },

    "props": {
        "telegramBotId": {
            "type": String,
            "required": true,
        },
    },

    "methods": {
        async refresh () {
            const res = await this.$api.call( "administration/telegram-bots/get-bot", this.telegramBotId || "1" );

            this.$refs.cardsPanel.setResult( res );

            if ( res.ok ) {
                this._record = new TelegramBotModel( res.data );
            }
        },
    },
};
</script>

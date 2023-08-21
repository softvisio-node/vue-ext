<template>
    <CardsPanel ref="cardsPanel" flex="1" @refresh="refresh">
        <template #data>
            <ext-panel ref="dataPanel" layout="fit" viewModel="true">
                <ext-container bind="{record.name}"/>
            </ext-panel>
        </template>
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
                const record = new TelegramBotModel( res.data );

                this.$refs.dataPanel.ext.getViewModel().set( "record", record );
            }
        },
    },
};
</script>

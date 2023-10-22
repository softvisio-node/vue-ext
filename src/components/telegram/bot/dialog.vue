<template>
    <ext-dialog height="98%" layout="fit" :title="title" width="95%" @ready="_ready"/>
</template>

<script>
import TelegramBotComponent from "./component";

export default {
    "props": {
        "telegramBotRecord": {
            "type": Object,
            "required": true,
        },
    },

    "computed": {
        title () {
            return this.telegramBotRecord.get( "name" );
        },
    },

    "methods": {
        async _ready ( e ) {
            const panel = TelegramBotComponent.get( this.telegramBotRecord.get( "type" ) ).panel;

            await this.$mount( panel, {
                "props": {
                    "telegramBotId": this.telegramBotRecord.id,
                },
            } );
        },
    },
};
</script>

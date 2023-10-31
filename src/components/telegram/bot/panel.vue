<template>
    <ext-panel layout="hbox">
        <BotInfoPanel flex="1" :telegramBotId="telegramBotId" @botDelete="_onBotDelete"/>

        <BotStatsPanel minWidth="400" resizable='{"edges":"west","snap":200,"split":true}' scrollable="true" :telegramBotId="telegramBotId" width="400"/>
    </ext-panel>
</template>

<script>
import BotInfoPanel from "./info.panel";
import BotStatsPanel from "./stats.panel";

export default {
    "components": { BotInfoPanel, BotStatsPanel },

    "props": {
        "telegramBotId": {
            "type": String,
            "required": true,
        },
    },

    "emits": ["botDelete"],

    "methods": {
        _onBotDelete () {
            this.$emit( "botDelete" );
        },
    },
};
</script>

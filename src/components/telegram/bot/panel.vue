<template>
    <ext-panel layout="hbox">
        <BotInfoPanel flex="1" :telegramBotId="telegramBotId"/>
        <BotStatsPanel flex="1" resizable='{"edges":"west","snap":200,"split":true}' scrollable="true" :telegramBotId="telegramBotId"/>
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
};
</script>

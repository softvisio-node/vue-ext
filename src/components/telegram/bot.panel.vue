<template>
    <ext-panel layout="hbox">
        <BotInfoPanel flex="1" :telegramBotId="telegramBotId"/>
        <BotStatsPanel flex="1" :telegramBotId="telegramBotId"/>
    </ext-panel>
</template>

<script>
import BotInfoPanel from "./bot-info.panel";
import BotStatsPanel from "./bot-stats.panel";

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

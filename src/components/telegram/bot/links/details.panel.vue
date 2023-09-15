<template>
    <ext-panel layout="vbox">
        <BotLinkInfoPanel flex="1" :telegramBotLinkRecord="telegramBotLinkRecord"/>

        <BotLinkStatsPanel flex="1" scrollable="true" :telegramBotLinkRecord="telegramBotLinkRecord"/>
    </ext-panel>
</template>

<script>
import BotLinkInfoPanel from "./info.panel";
import BotLinkStatsPanel from "./stats.panel";

export default {
    "components": { BotLinkInfoPanel, BotLinkStatsPanel },

    "props": {
        "telegramBotLinkRecord": {
            "type": Object,
            "default": null,
        },
    },
};
</script>

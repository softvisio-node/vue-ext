<template>
    <ext-panel layout="vbox">
        <BotLinkInfoPanel flex="1" :telegramBotLinkRecord="telegramBotLinkRecord"/>

        <BotLinkStatsPanel minWidth="400" resizable='{"edges":"west","snap":200,"split":true}' scrollable="true" :telegramBotLinkRecord="telegramBotLinkRecord" width="400"/>
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

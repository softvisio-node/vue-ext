<template>
    <ext-tabpanel>
        <ext-panel layout="fit" :title="l10n(`Info`)">
            <BotLinkInfoPanel flex="1" :telegramBotLinkRecord="telegramBotLinkRecord"/>
        </ext-panel>

        <ext-panel layout="fit" :title="l10n(`Charts`)">
            <BotLinkStatsPanel flex="1" scrollable="true" :telegramBotLinkRecord="telegramBotLinkRecord"/>
        </ext-panel>
    </ext-tabpanel>
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

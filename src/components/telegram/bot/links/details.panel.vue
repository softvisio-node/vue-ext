<template>
    <ext-tabpanel flex="1" layout='{"animation":{"direction":"vertical","type":"slide"}}' margin="1 0 0  0" tabBar='{"defaults":{"flex":null,"height":150,"textAlign":"center","width":40},"layout":{"align":"start","pack":"start","type":"vbox"}}' tabBarPosition="left" tabRotation1="none" viewModel="true">
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

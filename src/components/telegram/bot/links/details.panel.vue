<template>
    <ext-tabpanel layout='{"animation":{"direction":"vertical","type":"slide"}}' tabBar='{"defaults":{"flex":null,"height":150,"textAlign":"center","width":45},"layout":{"align":"start","pack":"start","type":"vbox"}}' tabBarPosition="left" tabRotation1="none" viewModel="true">
        <ext-panel layout="fit" :title="l10n(`Info`)">
            <BotLinkInfoPanel :telegramBotLinkRecord="telegramBotLinkRecord"/>
        </ext-panel>

        <ext-panel iconAlign="left" iconCls="fa-solid fa-chart-line" layout="fit" :title="l10n(`Charts`)">
            <BotLinkStatsPanel scrollable="true" :telegramBotLinkRecord="telegramBotLinkRecord"/>
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

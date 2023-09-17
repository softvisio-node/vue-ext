<template>
    <ext-tabpanel layout='{"animation":{"direction":"vertical","type":"slide"}}' tabBar='{"defaults":{"flex":null,"height":150,"textAlign":"center","width":45},"layout":{"align":"start","pack":"start","type":"vbox"}}' tabBarPosition="left" tabRotation1="none" viewModel="true">
        <ext-panel layout="fit" :title="l10n(`Info`)">
            <BotLinkInfoPanel :telegramBotLinkRecord="telegramBotLinkRecord" @delete="_onLinkDelete"/>
        </ext-panel>

        <ext-panel layout="fit" :title="l10n(`Stats`)">
            <BotLinkStatsPanel :telegramBotLinkRecord="telegramBotLinkRecord"/>
        </ext-panel>

        <ext-panel iconAlign="left" iconCls="fa-solid fa-chart-line" layout="fit" :title="l10n(`Charts`)">
            <BotLinkChartsPanel scrollable="true" :telegramBotLinkRecord="telegramBotLinkRecord"/>
        </ext-panel>
    </ext-tabpanel>
</template>

<script>
import BotLinkInfoPanel from "./info.panel";
import BotLinkStatsPanel from "./stats.panel";
import BotLinkChartsPanel from "./charts.panel";

export default {
    "components": { BotLinkInfoPanel, BotLinkStatsPanel, BotLinkChartsPanel },

    "props": {
        "telegramBotLinkRecord": {
            "type": Object,
            "default": null,
        },
    },

    "emits": ["delete"],

    "methods": {
        _onLinkDelete ( telegramBotLinkrecord ) {
            this.$emit( "delete", telegramBotLinkrecord );
        },
    },
};
</script>

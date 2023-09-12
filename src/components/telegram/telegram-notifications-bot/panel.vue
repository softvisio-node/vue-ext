<template>
    <ext-tabpanel flex="1" layout='{"animation":{"direction":"vertical","type":"slide"}}' margin="1 0 0  0" tabBar='{"defaults":{"flex":null,"style":"font-size:.7em","textAlign":"center","width":120},"layout":{"align":"start","pack":"start","type":"vbox"}}' tabBarPosition="left" tabRotation="none" viewModel="true" @ready="_ready">
        <!-- info tab -->
        <ext-panel iconCls="fa-brands fa-telegram" layout="fit" :title="l10n(`Bot info`)">
            <BotPanel :telegramBotId="telegramBotId"/>
        </ext-panel>

        <!-- links -->
        <ext-panel iconCls="fa-solid fa-link" layout="fit" :title="l10n(`Bot links`)">
            <BotLinksPanel :telegramBotId="telegramBotId"/>
        </ext-panel>
    </ext-tabpanel>
</template>

<script>
import BotPanel from "#src/components/telegram/bot/panel";
import BotLinksPanel from "#src/components/telegram/bot/links/panel";

export default {
    "components": { BotPanel, BotLinksPanel },

    "props": {
        "telegramBotId": {
            "type": String,
            "required": true,
        },
    },

    "methods": {
        _ready ( e ) {},
    },
};
</script>

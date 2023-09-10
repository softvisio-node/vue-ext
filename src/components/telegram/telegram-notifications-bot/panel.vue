<template>
    <ext-tabpanel flex="1" layout='{"animation":{"direction":"vertical","type":"slide"}}' margin="1 0 0  0" tabBar='{"defaults":{"flex":null,"style":"font-size:.7em","textAlign":"center","width":120},"layout":{"align":"start","pack":"start","type":"vbox"}}' tabBarPosition="left" tabRotation="none" viewModel="true" @ready="_ready">
        <!-- info tab -->
        <ext-panel iconCls="fa-brands fa-telegram" layout="fit" :title="l10n(`Bot info`, { domain: `vue-ext` })">
            <BotPanel :telegramBotId="telegramBotId"/>
        </ext-panel>
    </ext-tabpanel>
</template>

<script>
import BotPanel from "#src/components/telegram/bot/panel";

export default {
    "components": { BotPanel },

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

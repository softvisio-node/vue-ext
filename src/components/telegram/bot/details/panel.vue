<template>
    <ext-panel layout="hbox">
        <BotInfoPanel flex="1" :telegramBotId="telegramBotId"/>

        <BotChartsPanel minWidth="400" resizable='{"edges":"west","snap":200,"split":true}' scrollable="true" :telegramBotId="telegramBotId" width="400"/>
    </ext-panel>
</template>

<script>
import BotInfoPanel from "./info.panel";
import BotChartsPanel from "./charts.panel";

export default {
    "components": { BotInfoPanel, BotChartsPanel },

    "props": {
        "telegramBotId": {
            "type": String,
            "required": true,
        },
    },
};
</script>

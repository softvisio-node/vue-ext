<template>
    <ext-dialog height="90%" layout="fit" scrollable="true" :title="title" width="600">
        <DetailsPanel :telegramBotUserRecord="telegramBotUserRecord"/>
    </ext-dialog>
</template>

<script>
import DetailsPanel from "./details.panel";

export default {
    "components": { DetailsPanel },

    "props": {
        "telegramBotUserRecord": {
            "type": Object,
            "required": true,
        },
    },

    "computed": {
        title () {
            return this.l10n( `Telegram bot user` ) + ": " + this.telegramBotUserRecord.get( "full_name" );
        },
    },

    "methods": {},
};
</script>

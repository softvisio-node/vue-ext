<template>
    <ext-dialog height="90%" layout="fit" scrollable="true" :title="title" viewModel="true" width="90%">
        <CharstPanel period="30 days" :telegramBotLinkRecord="telegramBotLinkRecord"/>
    </ext-dialog>
</template>

<script>
import CharstPanel from "./charts.panel";

export default {
    "components": { CharstPanel },

    "props": {
        "telegramBotLinkRecord": {
            "type": Object,
            "required": true,
        },
    },

    "computed": {
        title () {
            return this.l10n( `Telegram bot link charts` );
        },
    },

    "methods": {},
};
</script>

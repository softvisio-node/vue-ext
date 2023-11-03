<template>
    <ext-dialog height="90%" layout="fit" scrollable="true" :title="title" width="600">
        <LinkDetailsPanel :telegramBotLinkRecord="telegramBotLinkRecord" @linkDelete="_onLinkDelete"/>
    </ext-dialog>
</template>

<script>
import LinkDetailsPanel from "./details.dialog";

export default {
    "components": { LinkDetailsPanel },

    "props": {
        "telegramBotLinkRecord": {
            "type": Object,
            "required": true,
        },
    },

    "emits": ["linkDelete"],

    "computed": {
        title () {
            return this.l10n( `Telegram bot link` ) + ": " + this.telegramBotLinkRecord.get( "name" );
        },
    },

    "methods": {
        _onLinkDelete ( record ) {
            this.$emit( "linkDelete", record );

            this.ext.close();
        },
    },
};
</script>

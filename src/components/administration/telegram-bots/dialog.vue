<template>
    <ext-dialog :height="height" :layout="layout" scrollable="true" :title="title" :width="width">
        <TelegramBotsPanel/>
    </ext-dialog>
</template>

<script>
import TelegramBotsPanel from "./panel";

export default {
    "components": { TelegramBotsPanel },

    "props": {
        "title": {
            "type": String,
            "default": this.i18nd( `vue-ext`, `Telegram bots` ),
        },
        "width": {
            "type": String,
            "default": "90%",
        },
        "height": {
            "type": String,
            "default": "90%",
        },
        "layout": {
            "type": String,
            "default": "fit",
        },
    },
};
</script>

<template>
    <ext-dialog height="98%" layout="fit" :title="title" width="95%" @ready="_ready"/>
</template>

<script>
export default {
    "props": {
        "panel": {
            "type": Object,
            "required": true,
        },
        "telegramBotId": {
            "type": String,
            "required": true,
        },
        "title": {
            "type": String,
            "required": true,
        },
    },

    "methods": {
        async _ready ( e ) {
            await this.$mount( this.panel, {
                "props": {
                    "telegramBotId": this.telegramBotId,
                },
            } );
        },
    },
};
</script>

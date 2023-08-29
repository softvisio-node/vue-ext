<template>
    <ext-dialog height="95%" layout="card" :title="title" width="90%" @ready="_ready"/>
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

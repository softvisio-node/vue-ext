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
        "telegramBotRecord": {
            "type": Object,
            "required": true,
        },
    },

    "computed": {
        title () {
            return this.telegramBotRecord.get( "name" );
        },
    },

    "methods": {
        async _ready ( e ) {
            await this.$mount( this.panel, {
                "props": {
                    "telegramBotId": this.telegramBotRecord.id,
                },
            } );
        },
    },
};
</script>

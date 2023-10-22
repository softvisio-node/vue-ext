<template>
    <ext-panel>
        <ext-button :text="text"/>
    </ext-panel>
</template>

<script>
import CreateBotDialog from "./create-bot.dialog";

export default {
    "computed": {
        text () {
            return `<img src="/api/avatar/-1" width=32 height=32/>  ` + this.l10n( `Select Telegram bot` );
        },
    },

    "methods": {
        async _showCreateotDialog () {
            const cmp = await this.$mount( CreateBotDialog );

            cmp.ext.show();
        },
    },
};
</script>

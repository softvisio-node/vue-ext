<template>
    <ext-panel>
        <ext-button :hidden="hidden" iconCls="fa-solid fa-plus" :text="l10n(`Createbot`)" @tap="_showCreateotDialog"/>
    </ext-panel>
</template>

<script>
import CreateBotDialog from "./create-bot.dialog";

export default {
    data () {
        return {
            "hidden": !this.$app.user.hasPermissions( "telegram/bot:create" ),
        };
    },

    "methods": {
        async _showCreateotDialog () {
            const cmp = await this.$mount( CreateBotDialog );

            cmp.ext.show();
        },
    },
};
</script>

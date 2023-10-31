<template>
    <ext-panel>
        <ext-button :hidden="hidden" iconCls="fa-solid fa-plus" :text="l10n(`Createbot`)" :ui="ui" @tap="_showCreateotDialog"/>
    </ext-panel>
</template>

<script>
import CreateBotDialog from "./create-bot.dialog";
import TelegramBotComponents from "./bot/component";

export default {
    "props": {
        "ui": {
            "type": String,
            "default": null,
        },
    },

    "emits": ["botCreate"],

    data () {
        return {
            "hidden": !( TelegramBotComponents.hasPublicComponents && this.$app.user.hasPermissions( "telegram/bot:create" ) ),
        };
    },

    "methods": {
        async _showCreateotDialog () {
            const cmp = await this.$mount( CreateBotDialog, {
                "props": {
                    "onBotCreate": () => this.$emit( "botCreate" ),
                },
            } );

            cmp.ext.show();
        },
    },
};
</script>

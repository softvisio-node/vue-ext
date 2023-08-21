<template>
    <CardsPanel ref="cardsPanel" flex="1" @refresh="refresh">
        <template #docked>
            <ext-toolbar docked="top">
                <ext-spacer/>
                <ext-button iconCls="fa-solid fa-redo" :text="l10nd(`vue-ext`, `Refresh`)" @tap="refresh"/>
            </ext-toolbar>
        </template>

        <template #data>
            <ext-panel ref="dataPanel" layout="fit" viewModel="true">
                <ext-panel defaults='{"labelAlign":"left","labelWidth":200}' padding="10 10 10 10">
                    <ext-field bind="{record.name}" :label="l10n(`vue-ext`, `Bot name`)"/>

                    <ext-field bind="{record.short_description}" :label="l10n(`vue-ext`, `Short description`)"/>

                    <ext-field bind="{record.description}" :label="l10n(`vue-ext`, `Description`)"/>

                    <ext-field bind="{record.type}" :label="l10n(`vue-ext`, `Type`)"/>

                    <ext-field bind="{record.static}" :label="l10n(`vue-ext`, `Static`)"/>

                    <ext-field bind="{record.created}" :label="l10n(`vue-ext`, `Creation date`)"/>

                    <ext-field bind="{record.telegram_username}" :label="l10n(`vue-ext`, `Telegram username`)"/>

                    <ext-field bind="{record.total_users}" :label="l10n(`vue-ext`, `Total users`)"/>
                    <ext-field bind="{record.total_subscribed_users}" :label="l10n(`vue-ext`, `Total subscribed users`)"/>
                    <ext-field bind="{record.total_unsubscribed_users}" :label="l10n(`vue-ext`, `Total unsubscribed users`)"/>
                    <ext-field bind="{record.total_returned_users}" :label="l10n(`vue-ext`, `Total returned users`)"/>
                    <ext-field bind="{record.total_banned_users}" :label="l10n(`vue-ext`, `Total banned users`)"/>
                </ext-panel>
            </ext-panel>
        </template>
    </CardsPanel>
</template>

<script>
import CardsPanel from "#src/components/cards.panel";
import TelegramBotModel from "./models/bot";

export default {
    "components": { CardsPanel },

    "props": {
        "telegramBotId": {
            "type": String,
            "required": true,
        },
    },

    "methods": {
        async refresh () {
            const res = await this.$api.call( "administration/telegram-bots/get-bot", this.telegramBotId );

            this.$refs.cardsPanel.setResult( res );

            if ( res.ok ) {
                const record = new TelegramBotModel( res.data );

                this.$refs.dataPanel.ext.getViewModel().set( "record", record );
            }
        },
    },
};
</script>

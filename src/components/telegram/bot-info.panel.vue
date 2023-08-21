<template>
    <CardsPanel ref="cardsPanel" @refresh="refresh">
        <template #data>
            <ext-panel ref="dataPanel" layout="fit" viewModel="true">
                <ext-toolbar docked="top">
                    <ext-spacer/>
                    <ext-button iconCls="fa-solid fa-redo" :text="l10nd(`vue-ext`, `Refresh`)" @tap="refresh"/>
                </ext-toolbar>

                <ext-panel defaults='{"labelAlign":"left","labelWidth":200}' padding="10 10 10 10" scrollable="true">
                    <ext-field bind="{record.name}" :label="l10n(`vue-ext`, `Bot name`)"/>

                    <ext-displayfield bind="{record.telegram_username}" :label="l10n(`vue-ext`, `Telegram username`)"/>

                    <ext-textareafield bind="{record.short_description}" :label="l10n(`vue-ext`, `Short description`)"/>

                    <ext-field bind="{record.description}" :label="l10n(`vue-ext`, `Description`)"/>

                    <ext-displayfield bind="{record.type}" :label="l10n(`vue-ext`, `Type`)"/>

                    <ext-displayfield bind="{record.static}" :label="l10n(`vue-ext`, `Static`)"/>

                    <ext-displayfield bind="{record.created}" :label="l10n(`vue-ext`, `Creation date`)"/>

                    <ext-displayfield bind="{record.total_users}" :label="l10n(`vue-ext`, `Total users`)"/>
                    <ext-displayfield bind="{record.total_subscribed_users}" :label="l10n(`vue-ext`, `Total subscribed users`)"/>
                    <ext-displayfield bind="{record.total_unsubscribed_users}" :label="l10n(`vue-ext`, `Total unsubscribed users`)"/>
                    <ext-displayfield bind="{record.total_returned_users}" :label="l10n(`vue-ext`, `Total returned users`)"/>
                    <ext-displayfield bind="{record.total_banned_users}" :label="l10n(`vue-ext`, `Total banned users`)"/>
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
            this.$refs.cardsPanel.mask();

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

<template>
    <ext-panel ref="cardsPanel" layout='{"animation":"slide","type":"card"}' @ready="_ready">
        <ext-panel ref="botListPanel" layout="fit">
            <BotsPanel @openBot="_openBot"/>
        </ext-panel>

        <ext-panel ref="botPanel" layout="fit">
            <ext-toolbar docked="top">
                <ext-button iconCls="fa-solid fa-arrow-left" text="Back to the bots list" @tap="_showBotsList"/>
                <ext-spacer width="10"/>
                <ext-avatar :src="botAvatar"/>
                <ext-spacer width="10"/>
                <ext-container :html="botName"/>
            </ext-toolbar>
        </ext-panel>
    </ext-panel>
</template>

<script>
import BotsPanel from "./list.panel";
import TelegramBotComponent from "./bot/component";
import BotDialog from "#src/components/telegram/bot/dialog";

// XXX
import "#src/components/telegram/telegram-notifications-bot/component";

export default {
    "components": { BotsPanel },

    data () {
        return {
            "botAvatar": null,
            "botName": null,
        };
    },

    "methods": {
        _ready ( e ) {
            this._showBotsList();
        },

        _showBotsList () {
            this.$refs.cardsPanel.ext.setActiveItem( 0 );

            this.$refs.botListPanel.ext.unmask();

            this._closeBot();
        },

        async _openBot ( record ) {
            this.$refs.botListPanel.ext.mask();

            const panel = TelegramBotComponent.get( record.get( "type" ) ).panel;

            this._closeBot();

            this.botAvatar = record.get( "avatar_url" );
            this.botName = record.get( "name" );

            const cmp = await this.$mount( panel, {
                "el": this.$refs.botPanel,
                "props": {
                    "telegramBotId": record.id,
                },
            } );

            this._openedBot = cmp;

            this.$refs.cardsPanel.ext.setActiveItem( 1 );
        },

        _closeBot () {
            if ( !this._openedBot ) return;

            this._openedBot.$unmount();

            this._openedBot = null;
        },

        async _showBotDialog ( button ) {
            const record = button.up( "gridrow" ).getRecord(),
                panel = TelegramBotComponent.get( record.get( "type" ) ).panel;

            const cmp = await this.$mount( BotDialog, {
                "props": {
                    panel,
                    "telegramBotId": record.id,
                    "title": record.get( "name" ),
                },
            } );

            cmp.ext.show();
        },
    },
};
</script>

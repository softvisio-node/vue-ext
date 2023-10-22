<template>
    <ext-panel ref="cardsPanel" layout='{"animation":"slide","type":"card"}' @ready="_ready">
        <ext-panel ref="botListPanel" layout="fit">
            <BotsPanel @openBot="_openBot"/>
        </ext-panel>

        <ext-panel ref="botPanel" layout="fit">
            <ext-toolbar docked="top">
                <ext-button text="Back" @tap="_showBotsList"/>
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

    "methods": {
        _ready ( e ) {
            this._showBotsList();
        },

        _showBotsList () {
            this.$refs.cardsPanel.ext.setActiveItem( 0 );

            this._closeBot();
        },

        async _openBot ( record ) {
            const panel = TelegramBotComponent.get( record.get( "type" ) ).panel;

            this._closeBot();

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

<template>
    <ext-panel ref="cardsPanel" layout='{"animation":"slide","type":"card"}' @ready="_ready">
        <ext-panel ref="botListPanel" layout="fit">
            <BotsPanel ref="botsListPanel" @openBot="_openBot"/>
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
import telegramComponents from "#src/components/telegram/components";
import BotDialog from "#src/components/telegram/bot/dialog";

// XXX
import "#src/components/telegram/telegram-notifications-bot/component";

export default {
    "components": { BotsPanel },

    "props": {
        "openBotInDialog": {
            "type": Boolean,
            "default": true,
        },
    },

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

            this._closeBotPanel();
        },

        async _openBot ( record ) {
            if ( this.openBotInDialog ) {
                this._showBotDialog( record );
            }
            else {
                this._showBotPanel( record );
            }
        },

        async _showBotDialog ( record ) {
            const cmp = await this.$mount( BotDialog, {
                "props": {
                    "telegramBotRecord": record,
                    "onBotDelete": () => this._onBotDelete(),
                },
            } );

            cmp.ext.show();
        },

        async _showBotPanel ( record ) {
            this.$refs.botListPanel.ext.mask();

            const panel = telegramComponents.get( record.get( "type" ) ).panel;

            this._closeBotPanel();

            this.botAvatar = record.get( "avatar_url" );
            this.botName = record.get( "name" );

            const cmp = await this.$mount( panel, {
                "el": this.$refs.botPanel,
                "props": {
                    "telegramBotId": record.id,
                    "onBotDelete": () => this._onBotDelete(),
                },
            } );

            this._openedBot = cmp;

            this.$refs.cardsPanel.ext.setActiveItem( 1 );
        },

        _closeBotPanel () {
            if ( !this._openedBot ) return;

            this._openedBot.$unmount();

            this._openedBot = null;
        },

        _onBotDelete () {
            this.$refs.botsListPanel.refresh();

            this._showBotsList();
        },
    },
};
</script>

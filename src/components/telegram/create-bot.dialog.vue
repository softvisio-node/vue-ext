<template>
    <ext-dialog height="500" layout="fit" :title="l10n(`Create Telegram bot`)" width="500">
        <ext-panel ref="cardsPanel" layout='{"animation":"slide","type":"card"}' @ready="_ready">
            <!-- api key panel -->
            <ext-fieldpanel ref="apiKeyPanel">
                <ext-textfield :label="l10n(`Enter your Telegram bot API token`)" name="api_key" required="true"/>

                <ext-toolbar docked="bottom">
                    <ext-spacer/>
                    <ext-button :text="l10n(`Next`)" ui="action" @tap="_checkApiKey"/>
                </ext-toolbar>
            </ext-fieldpanel>

            <!-- bot type panel -->
            <ext-fieldpanel ref="botTypePanel">
                <ext-displayfield :label="l10n(`Telegram bot username`)"/>

                <ext-displayfield :label="l10n(`Telegram bot name`)"/>

                <ext-toolbar docked="bottom">
                    <ext-spacer/>
                    <ext-button :text="l10n(`Next`)" ui="action" @tap="_checkApiKey"/>
                </ext-toolbar>
            </ext-fieldpanel>
        </ext-panel>
    </ext-dialog>
</template>

<script>
export default {
    "methods": {
        _ready ( e ) {
            e.detail.cmp.setActiveItem( 0 );
        },

        async _checkApiKey () {
            const form = this.$refs.apiKeyPanel.ext;

            if ( !form.validate() ) return;

            const res = await this.$api.call( "telegram/bots/check-bot-api-key", form.getValues().api_key );

            if ( !res.ok ) {
                this.$toast( res );
            }
            else {
                this.$refs.cardsPanel.ext.setActiveItem( this.$refs.botTypePanel.ext );
            }
        },

        async _createBot () {},
    },
};
</script>

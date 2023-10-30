<template>
    <ext-dialog height="500" layout="fit" :title="l10n(`Create Telegram bot`)" width="500">
        <ext-panel ref="cardsPanel" layout='{"animation":"slide","type":"card"}' @ready="_ready">
            <!-- api token panel -->
            <ext-fieldpanel ref="apiTokenPanel">
                <ext-textfield :label="l10n(`Enter your Telegram bot API token`)" name="api_token" required="true"/>

                <ext-comboboxfield displayField="name" displayTpl="{name}" forceSelection="true" :label="l10n(`Telegram bot type`)" :placeholder="l10n(`Select Telegram bot tyoe`)" required="true" :store="store" triggerAction="all" valueField="id" @change="_onBotTypeChange" @ready="_onBotTypeComboReady"/>

                <ext-spacer height="10"/>

                <ext-container ref="description"/>

                <ext-toolbar docked="bottom">
                    <ext-spacer/>
                    <ext-button :text="l10n(`Next`)" ui="action" @tap="_checkApiToken"/>
                </ext-toolbar>
            </ext-fieldpanel>

            <!-- bot type panel -->
            <ext-fieldpanel ref="botTypePanel">
                <ext-displayfield :label="l10n(`Telegram bot username`)"/>

                <ext-displayfield :label="l10n(`Telegram bot name`)"/>

                <ext-toolbar docked="bottom">
                    <ext-spacer/>
                    <ext-button :text="l10n(`Next`)" ui="action" @tap="_checkApiToken"/>
                </ext-toolbar>
            </ext-fieldpanel>
        </ext-panel>
    </ext-dialog>
</template>

<script>
import TelegramBotComponents from "./bot/component";

export default {
    data () {
        return {
            "store": TelegramBotComponents.store,
        };
    },

    "methods": {
        _ready ( e ) {
            e.detail.cmp.setActiveItem( 0 );
        },

        _onBotTypeComboReady ( e ) {
            const cmp = e.detail.cmp;

            cmp.setItemTpl( `
<div style="font-size:1.3em">
    {name}
</div>
<br/>
<div style="max-height:50px;text-overflow:ellipsis">
    {short_description}
</div>
` );
        },

        _onBotTypeChange ( e ) {
            const value = e.detail.newValue;

            if ( value ) {
                this.$refs.description.ext.setHtml( TelegramBotComponents.get( value ).description );
            }
            else {
                this.$refs.description.ext.setHtml( "" );
            }
        },

        async _checkApiToken () {
            const form = this.$refs.apiTokenPanel.ext;

            if ( !form.validate() ) return;

            const res = await this.$api.call( "telegram/bots/check-bot-api-token", form.getValues().api_token );

            if ( !res.ok ) {
                this.$toast( res );
            }
            else {
                this.$refs.cardsPanel.ext.setActiveItem( this.$refs.botTypePanel.ext );
            }
        },
    },
};
</script>

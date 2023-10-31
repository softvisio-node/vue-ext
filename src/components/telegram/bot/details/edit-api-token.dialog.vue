<template>
    <ext-dialog height="90%" layout="vbox" :title="l10n(`Change bot API token`)" width="700" @ready="_ready">
        <ext-formpanel ref="formPanel" flex="1" layout="vbox" modelValidation="true" trackResetOnLoad="true">
            <ext-textfield :label="l10n(`Bot API token`)" name="api_token" :placeholder="l10n(`Enter new API token`)" required="true"/>
        </ext-formpanel>

        <ext-toolbar docked="bottom">
            <ext-spacer/>
            <ext-button ref="saveButton" disabled="true" iconCls="fa-solid fa-check" :text="l10n(`Save`)" ui="action" @tap="_save"/>
        </ext-toolbar>
    </ext-dialog>
</template>

<script>
export default {
    "props": {
        "telegramBotId": {
            "type": String,
            "required": true,
        },
    },

    "methods": {
        _ready ( e ) {
            const cmp = e.detail.cmp;

            cmp.on( "beforeClose", () => {
                if ( this._saving ) return false;
            } );

            this.$refs.formPanel.ext.on( "dirtychange", ( cmp, dirty ) => this.$refs.saveButton.ext.setDisabled( !dirty ) );
        },

        async _save () {
            const form = this.$refs.formPanel.ext;

            if ( !form.valudate() ) return;

            const values = form.getValues();

            this.ext.mask();
            this._saving = true;

            const res = await this.$api.call( "telegram/bots/set-bot-api-token", this.telegramBotId, values.api_token );

            this._saving = false;
            this.ext.unmask();

            if ( res.ok ) {
                this.$toast( `Bot updated` );

                this.ext.close();
            }
            else {
                this.$toast( res );
            }
        },
    },
};
</script>

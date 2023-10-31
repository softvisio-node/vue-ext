<template>
    <ext-dialog height="90%" layout="vbox" :title="l10n(`Edit bot details`)" width="700" @ready="_ready">
        <ext-formpanel ref="formPanel" flex="1" layout="vbox" modelValidation="true" trackResetOnLoad="true">
            <ext-textfield :label="l10n(`Bot name`)" labelAlign="top" maxLength="64" name="name"/>

            <ext-textareafield :label="l10n(`Short description`) + `.<br/>` + l10n(`Bot short description is shown on the bot profile page and is sent together with the link when users share the bot.`)" labelAlign="top" maxLength="120" name="short_description" wrap="off"/>

            <ext-textareafield flex="1" :label="l10n(`Description`) + `.<br/>` + l10n(`Bot description is shown in the chat with the bot if the chat is empty.`)" labelAlign="top" maxLength="512" name="description" wrap="off"/>
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

            this.$refs.formPanel.ext.setRecord( this.record );
        },

        async _save () {
            this._saving = true;

            const values = this.$refs.formPanel.ext.getValues();

            this.ext.mask();
            this._saving = true;

            const res = await this.$api.call( "telegram/bots/set-bot-api-token", this.record.id, values );

            this._saving = false;
            this.ext.unmask();

            if ( res.ok ) {
                this.$refs.formPanel.ext.fillRecord( this.record );

                this.ext.close();
            }
            else {
                this.$toast( res );
            }
        },
    },
};
</script>

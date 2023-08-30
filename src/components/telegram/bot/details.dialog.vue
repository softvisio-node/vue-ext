<template>
    <ext-dialog height="80%" layout="vbox" :title="l10n(`vue-ext`, `Edit bot details`)" width="80%" @ready="_ready">
        <ext-formpanel ref="formPanel" flex="1" layout="vbox" modelValidation="true" trackResetOnLoad="true">
            <ext-textfield :label="l10n(`vue-ext`, `Bot name`)" labelAlign="top" maxLength="64" name="name"/>

            <ext-textareafield :label="l10n(`vue-ext`, `Short description`) + `.<br/>` + l10n(`vue-ext`, `Bot short description is shown on the bot profile page and is sent together with the link when users share the bot.`)" labelAlign="top" maxLength="120" name="short_description"/>

            <ext-textareafield flex="1" :label="l10n(`vue-ext`, `Description`) + `.<br/>` + l10n(`vue-ext`, `Bot description is shown in the chat with the bot if the chat is empty.`)" labelAlign="top" maxLength="512" name="description"/>
        </ext-formpanel>

        <ext-toolbar docked="bottom">
            <ext-spacer/>
            <ext-button ref="saveButton" disabled="true" iconCls="fa-solid fa-check" :text="l10nd(`vue-ext`, `Save`)" ui="action" @tap="_save"/>
            <ext-spacer width="20"/>
            <ext-button ref="cancelButton" iconCls="fa-solid fa-xmark" :text="l10nd(`vue-ext`, `Cancel`)" @tap="_cancel"/>
        </ext-toolbar>
    </ext-dialog>
</template>

<script>
export default {
    "props": {
        "record": {
            "type": Object,
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

        _cancel () {
            this.ext.close();
        },

        async _save () {
            this._saving = true;
            this.$refs.cancelButton.ext.disable();
            this.$refs.saveButton.ext.disable();

            const values = this.$refs.formPanel.ext.getValues();

            const res = await this.$api.call( "telegram/bots/update-bot-details", this.record.id, values );

            this._saving = false;
            this.$refs.cancelButton.ext.enable();
            this.$refs.saveButton.ext.enable();

            if ( res.ok ) {
                this.$refs.formPanel.ext.fillRecord( this.record );

                this.ext.close();
            }
            else {
                this.$utils.toast( res );
            }
        },
    },
};
</script>

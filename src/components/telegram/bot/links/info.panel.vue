<template>
    <CardsPanel ref="cardsPanel" @ready="ready">
        <template #data>
            <ext-panel ref="dataPanel" layout="fit" viewModel="true">
                <ext-toolbar docked="top">
                    <ext-spacer/>
                    <ext-button iconCls="fa-solid fa-redo" :text="l10n(`Refresh`)" @tap="refresh"/>
                </ext-toolbar>

                <ext-formpanel ref="form" defaults='{"labelAlign":"top"}' layout="vbox" padding="0 0 0 5">
                    <ext-displayfield bind="{record.name}" :hidden="edit" :label="l10n(`Name`)"/>
                    <ext-textfield :hidden="!edit" :label="l10n(`Name`)" name="name" required="truw"/>

                    <ext-displayfield bind="{record.created}" :label="l10n(`Creation date`)" renderer="Ext.util.Format.dateRenderer('dateStyle:short,timeStyle:short')"/>

                    <ext-textareafield bind="{record.description}" flex="1" :hidden="edit" :label="l10n(`Description`)" readOnly="true"/>
                    <ext-textareafield flex="1" :hidden="!edit" :label="l10n(`Description`)" name="description"/>
                </ext-formpanel>

                <ext-toolbar docked="bottom">
                    <ext-button bind='{"hidden":"{!record.can_delete}"}' iconCls="fa-solid fa-trash-alt" :text="l10n(`Delete bot`)" @tap="_deleteBot"/>
                    <ext-spacer/>
                    <ext-button :hidden="edit" iconCls="fa-solid fa-pen" :text="l10n(`Edit`)" @tap="startEdit"/>
                    <ext-button :hidden="!edit" iconCls="fa-solid fa-check" :text="l10n(`Save`)" ui="action" @tap="save"/>
                    <ext-button :hidden="!edit" iconCls="fa-solid fa-xmark" :text="l10n(`Cancel`)" ui="decline" @tap="cancel"/>
                </ext-toolbar>
            </ext-panel>
        </template>
    </CardsPanel>
</template>

<script>
import CardsPanel from "#src/components/cards.panel";

export default {
    "components": { CardsPanel },

    "props": {
        "telegramBotLinkRecord": {
            "type": Object,
            "default": null,
        },
    },

    data () {
        return {
            "edit": false,
        };
    },

    "watch": {
        telegramBotLinkRecord ( newValue, oldValue ) {
            this._onRecordChange();
        },
    },

    "methods": {
        ready ( e ) {
            this._onRecordChange();
        },

        // protected
        _onRecordChange () {
            this.$refs.dataPanel.ext.getViewModel().set( "record", this.telegramBotLinkRecord );

            this.cancel();

            if ( this.telegramBotLinkRecord ) {
                this.$refs.cardsPanel.showDataPanel();
            }
            else {
                this.$refs.cardsPanel.showNoDataPanel();
            }
        },

        startEdit () {
            if ( !this.telegramBotLinkRecord ) return;

            this.$refs.form.ext.setRecord( this.telegramBotLinkRecord );

            this.edit = true;
        },

        cancel () {
            this.edit = false;

            this.$refs.form.ext.setRecord( null );
        },

        // XXX
        async save () {

            // form is not valid
            if ( !this.$refs.form.ext.validate() ) return;

            this.$refs.form.ext.fillRecord( this.telegramBotLinkRecord );
            this.$refs.form.ext.setRecord( null );

            this.edit = false;

            this.telegramBotLinkRecord.commit();
        },

        // XXX
        async _deleteLink ( e ) {
            if ( !( await this.$utils.confirm( this.l10n( "Are you sure you want to delete this bot and all it's data? This operation is not revertable." ) ) ) ) return;

            const record = this.record,
                button = e.detail.sender;

            button.disable();

            const res = await this.$api.call( "telegram/bots/delete-bot", record.id );

            button.enable();

            if ( res.ok ) {
                this.refresh();
            }
            else {
                this.$toast( res );
            }
        },

        // XXX
        _copyBotUrl () {
            this.$utils.copyToClipboard( this.record.get( "url" ) );

            this.$toast( this.l10n( "Link copied to the clipboard" ) );
        },
    },
};
</script>

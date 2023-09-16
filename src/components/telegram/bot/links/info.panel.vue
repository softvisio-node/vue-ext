<template>
    <CardsPanel ref="cardsPanel" @ready="ready">
        <template #data>
            <ext-panel ref="dataPanel" layout="fit" viewModel="true">
                <ext-toolbar docked="top">
                    <ext-spacer/>
                    <ext-button iconCls="fa-solid fa-redo" :text="l10n(`Refresh`)" @tap="refresh"/>
                </ext-toolbar>

                <!-- view -->
                <ext-formpanel ref="view" defaults='{"labelAlign":"top"}' :hidden="edit" layout="vbox" padding="0 0 0 5">
                    <ext-displayfield :label="l10n(`Name`)" name="name"/>

                    <ext-textareafield flex="1" :label="l10n(`Description`)" name="description" readOnly="true"/>
                </ext-formpanel>

                <!-- edit -->
                <ext-formpanel ref="edit" defaults='{"labelAlign":"top"}' :hidden="!edit" layout="vbox" padding="0 0 0 5" trackResetOnLoad="true">
                    <ext-textfield :label="l10n(`Name`)" name="name" required="truw"/>

                    <ext-textareafield flex="1" :label="l10n(`Description`)" name="description"/>
                </ext-formpanel>

                <ext-toolbar docked="bottom">
                    <ext-button bind1='{"hidden":"{!record.can_delete}"}' iconCls="fa-solid fa-trash-alt" :text="l10n(`Delete`)" ui="decline" @tap="_deleteLink"/>

                    <ext-spacer/>

                    <ext-button :hidden="edit" iconCls="fa-solid fa-pen" :text="l10n(`Edit`)" @tap="startEdit"/>

                    <ext-button :disabled="!dirty" :hidden="!edit" iconCls="fa-solid fa-check" :text="l10n(`Save`)" ui="action" @tap="updateLink"/>
                    <ext-button :hidden="!edit" iconCls="fa-solid fa-xmark" :text="l10n(`Cancel`)" @tap="cancelEdit"/>
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
            "dirty": false,
        };
    },

    "watch": {
        telegramBotLinkRecord ( newValue, oldValue ) {
            this._onRecordChange();
        },
    },

    "methods": {
        ready ( e ) {
            this.$refs.edit.ext.on( "dirtyChange", ( form, dirty ) => ( this.dirty = dirty ) );

            this._onRecordChange();
        },

        // protected
        _onRecordChange () {
            if ( this.telegramBotLinkRecord ) {
                this.cancelEdit();

                this.$refs.cardsPanel.showDataPanel();

                this.$refs.view.ext.setRecord( this.telegramBotLinkRecord );
            }
            else {
                this.$refs.cardsPanel.showNoDataPanel();
            }
        },

        startEdit () {
            this.$refs.edit.ext.setValues( this.telegramBotLinkRecord.getData() );

            this.edit = true;
        },

        cancelEdit () {
            this.edit = false;
        },

        async updateLink () {

            // form is not valid
            if ( !this.$refs.edit.ext.validate() ) return;

            const res = await this.$api.call( "telegram/bots/links/update-link", this.telegramBotLinkRecord.id, this.$refs.edit.ext.getValues() );

            if ( res.ok ) {
                this.$refs.edit.ext.fillRecord( this.telegramBotLinkRecord );

                this.telegramBotLinkRecord.commit();

                this.$refs.view.ext.setRecord( null );
                this.$refs.view.ext.setRecord( this.telegramBotLinkRecord );

                this.edit = false;

                this.$toast( this.l10n( `Link updated` ) );
            }
            else {
                this.$toast( res );
            }
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

<template>
    <CardsPanel ref="cardsPanel" @ready="ready">
        <template #data>
            <ext-panel ref="dataPanel" layout="vbox" viewModel="true">
                <ext-toolbar docked="top">
                    <ext-spacer/>
                    <ext-button iconCls="fa-solid fa-redo" :text="l10n(`Refresh`)" @tap="refresh"/>
                </ext-toolbar>

                <!-- view -->
                <ext-formpanel ref="view" bind='{"hidden":"{editStarted}"}' flex="1" layout="vbox" padding="0 0 0 10">
                    <ext-displayfield bind="{telegramBotLinkRecord.name}" :label="l10n(`Name`)"/>

                    <ext-container layout='{"align":"start","type":"hbox"}'>
                        <ext-displayfield bind="{telegramBotLinkRecord.link}" flex="1" :label="l10n(`Link`)"/>

                        <ext-button iconCls="fa-regular fa-copy" :tooltip="l10n(`Copy link`)" @tap="_copyLink"/>
                    </ext-container>

                    <ext-textareafield bind="{telegramBotLinkRecord.description}" flex="1" :label="l10n(`Description`)" readOnly="true"/>
                </ext-formpanel>

                <!-- edit -->
                <ext-formpanel ref="edit" bind='{"hidden":"{!editStarted}"}' flex="1" layout="vbox" padding="0 0 0 10" trackResetOnLoad="true">
                    <ext-textfield :label="l10n(`Name`)" name="name" required="truw"/>

                    <ext-container layout='{"align":"start","type":"hbox"}'>
                        <ext-displayfield bind="{telegramBotLinkRecord.link}" flex="1" :label="l10n(`Link`)"/>

                        <ext-button iconCls="fa-regular fa-copy" :tooltip="l10n(`Copy link`)" @tap="_copyLink"/>
                    </ext-container>

                    <ext-textareafield flex="1" :label="l10n(`Description`)" name="description"/>
                </ext-formpanel>

                <ext-toolbar docked="bottom">
                    <ext-button bind='{"hidden":"{!telegramBotRecord.can_delete_link}"}' iconCls="fa-solid fa-trash-alt" :text="l10n(`Delete`)" ui="decline" @tap="_deleteLink"/>

                    <ext-spacer/>

                    <ext-button bind='{"hidden":"{editButtonHidden}"}' iconCls="fa-solid fa-pen" :text="l10n(`Edit`)" @tap="startEdit"/>

                    <ext-button bind='{"disabled":"{saveButtonDisabled}","hidden":"{saveButtonHidden}"}' iconCls="fa-solid fa-check" :text="l10n(`Save`)" @tap="updateLink"/>
                    <ext-button bind='{"hidden":"{cancelButtonHidden}"}' iconCls="fa-solid fa-xmark" :text="l10n(`Cancel`)" @tap="cancelEdit"/>
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

    "emits": ["linkDelete"],

    "watch": {
        telegramBotLinkRecord ( newValue, oldValue ) {
            this._onRecordChange();
        },
    },

    "methods": {
        async refresh () {
            const res = await this.$api.call( "telegram/bots/links/get-link", this.telegramBotLinkRecord.id );

            if ( res.ok ) {
                this.telegramBotLinkRecord.set( res.data );
            }
            else {
                this.$toast( res );
            }
        },

        ready ( e ) {
            this.$refs.dataPanel.ext.getViewModel().setFormulas( {
                "editButtonHidden": {
                    "bind": {
                        "canEdit": "{telegramBotRecord.can_update_link}",
                        "editStarted": "{editStarted}",
                    },
                    get ( data ) {
                        if ( !data.canEdit ) return true;

                        if ( data.editStarted ) return true;

                        return false;
                    },
                },
                "cancelButtonHidden": {
                    "bind": {
                        "canEdit": "{telegramBotRecord.can_update_link}",
                        "editStarted": "{editStarted}",
                    },
                    get ( data ) {
                        if ( !data.canEdit ) return true;

                        if ( !data.editStarted ) return true;

                        return false;
                    },
                },

                "saveButtonHidden": {
                    "bind": {
                        "canEdit": "{telegramBotRecord.can_update_link}",
                        "editStarted": "{editStarted}",
                    },
                    get ( data ) {
                        if ( !data.canEdit ) return true;

                        if ( !data.editStarted ) return true;

                        return false;
                    },
                },

                "saveButtonDisabled": {
                    "bind": {
                        "dirty": "{dirty}",
                    },
                    get ( data ) {
                        return !data.dirty;
                    },
                },
            } );

            this.$refs.edit.ext.on( "dirtyChange", ( form, dirty ) => {
                this.$refs.dataPanel.ext.getViewModel().set( "dirty", dirty );
            } );

            this._onRecordChange();
        },

        // protected
        _onRecordChange () {
            this.cancelEdit();

            this.$refs.dataPanel.ext.getViewModel().set( "telegramBotLinkRecord", this.telegramBotLinkRecord );

            if ( this.telegramBotLinkRecord ) {
                this.$refs.cardsPanel.showDataPanel();
            }
            else {
                this.$refs.cardsPanel.showNoDataPanel();
            }
        },

        startEdit () {
            this.$refs.edit.ext.setValues( this.telegramBotLinkRecord.getData() );

            this.$refs.dataPanel.ext.getViewModel().set( "editStarted", true );
        },

        cancelEdit () {
            this.$refs.dataPanel.ext.getViewModel().set( "editStarted", false );
        },

        async updateLink () {

            // form is not valid
            if ( !this.$refs.edit.ext.validate() ) return;

            // data not changed
            if ( !this.$refs.dataPanel.ext.getViewModel().get( "dirty" ) ) {
                return this.cancelEdit();
            }

            const res = await this.$api.call( "telegram/bots/links/update-link", this.telegramBotLinkRecord.id, this.$refs.edit.ext.getValues() );

            if ( res.ok ) {
                this.$refs.edit.ext.fillRecord( this.telegramBotLinkRecord );

                this.telegramBotLinkRecord.commit();

                this.$refs.dataPanel.ext.getViewModel().set( "editStarted", false );

                this.$toast( this.l10n( `Link updated` ) );
            }
            else {
                this.$toast( res );
            }
        },

        async _deleteLink ( e ) {
            if ( !( await this.$utils.confirm( this.l10n( "Are you sure you want to delete this link and all it's data? This operation is not revertable." ) ) ) ) return;

            const button = e.detail.sender;

            button.disable();

            const res = await this.$api.call( "telegram/bots/links/delete-link", this.telegramBotLinkRecord.id );

            button.enable();

            if ( res.ok ) {
                this.$toast( this.l10n( `Link deleted` ) );

                this.$refs.cardsPanel.showNoDataPanel();

                this.$emit( "linkDelete", this.telegramBotLinkRecord );
            }
            else {
                this.$toast( res );
            }
        },

        async _copyLink ( button ) {
            this.$utils.copyToClipboard( this.telegramBotLinkRecord.get( "link" ) );

            this.$toast( this.l10n( "Link copied to the clipboard" ) );
        },
    },
};
</script>

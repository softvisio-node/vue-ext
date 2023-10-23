<template>
    <CardsPanel ref="cardsPanel" @ready="ready">
        <template #dataPanel>
            <ext-panel ref="dataPanel" layout="vbox" padding="0 0 0 10" scrollable="true" viewModel="true">
                <ext-toolbar docked="top">
                    <ext-spacer/>
                    <ext-button iconCls="fa-regular fa-copy" :text="l10n(`Copy link`)" @tap="_copyLink"/>
                    <ext-button iconCls="fa-solid fa-redo" :text="l10n(`Refresh`)" @tap="refresh"/>
                </ext-toolbar>

                <ext-container bind='{"hidden":"{editName}"}' layout='{"align":"start","type":"hbox"}'>
                    <ext-displayfield bind="{telegramBotLinkRecord.name}" :label="l10n(`Name`)" labelAlign="left" labelWidth="150"/>
                    <ext-spacer/>

                    <ext-button bind='{"hidden":"{!telegramBotRecord.can_update_link}"}' iconCls="fa-solid fa-pen" :tooltip="l10n(`Edit`)" @tap="beginEditName"/>
                </ext-container>

                <ext-container bind='{"hidden":"{!editName}"}' layout='{"align":"start","type":"hbox"}'>
                    <ext-textfield ref="nameEditField" flex="1" :label="l10n(`Name`)" labelAlign="left" labelWidth="150"/>

                    <ext-spacer/>

                    <ext-button iconCls="fa-solid fa-check" :tooltip="l10n(`Save`)" @tap="saveName"/>

                    <ext-button iconCls="fa-solid fa-xmark" :tooltip="l10n(`Cancel`)" ui="decline" @tap="cancelEditName"/>
                </ext-container>

                <ext-panel defaults='{"labelAlign":"left","labelWidth":150}' padding="0 0 0 10">
                    <ext-displayfield bind="{record.created_html}" :label="l10n(`Creation date`)"/>

                    <ext-displayfield bind="{record.last_user_created_html}" :label="l10n(`Last user created`)" labelAlign="top"/>

                    <ext-displayfield bind="{record.total_users}" :label="l10n(`Total users`)"/>
                    <ext-displayfield bind="{record.total_subscribed_users_text}" :label="l10n(`Total subscribed users`)"/>
                    <ext-displayfield bind="{record.total_unsubscribed_users_text}" :label="l10n(`Total unsubscribed users`)"/>

                    <ext-displayfield bind="{record.total_returned_users_text}" :label="l10n(`Total returned users`)"/>
                    <ext-displayfield bind="{record.total_banned_users_text}" :label="l10n(`Total banned users`)"/>
                </ext-panel>

                <ext-container bind='{"hidden":"{editDescription}"}' layout='{"align":"start","type":"hbox"}'>
                    <ext-textareafield bind="{telegramBotLinkRecord.description}" flex="1" height="150" :label="l10n(`Description`)" labelAlign="left" labelWidth="150" readOnly="true"/>
                    <ext-spacer/>

                    <ext-button bind='{"hidden":"{!telegramBotRecord.can_update_link}"}' iconCls="fa-solid fa-pen" :tooltip="l10n(`Edit`)" @tap="beginEditDescription"/>
                </ext-container>

                <ext-container bind='{"hidden":"{!editDescription}"}' layout='{"align":"start","type":"hbox"}'>
                    <ext-textareafield ref="descriptionEditField" height="150" :label="l10n(`Description`)" labelAlign="left" labelWidth="150"/>

                    <ext-spacer/>

                    <ext-button iconCls="fa-solid fa-check" :tooltip="l10n(`Save`)" @tap="saveDescription"/>

                    <ext-button iconCls="fa-solid fa-xmark" :tooltip="l10n(`Cancel`)" ui="decline" @tap="cancelEditDescription"/>
                </ext-container>

                <ext-button bind='{"hidden":"{!telegramBotRecord.can_delete_link}"}' iconCls="fa-solid fa-trash-alt" :text="l10n(`Delete`)" ui="decline" @tap="_deleteLink"/>
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
            this._onRecordChange();
        },

        // protected
        _onRecordChange () {
            this.cancelEditName();
            this.cancelEditDescription();

            this.$refs.dataPanel.ext.getViewModel().set( "telegramBotLinkRecord", this.telegramBotLinkRecord );

            if ( this.telegramBotLinkRecord ) {
                this.$refs.cardsPanel.showDataPanel();
            }
            else {
                this.$refs.cardsPanel.showNoDataPanel();
            }
        },

        beginEditName () {
            this.$refs.nameEditField.ext.setValue( this.telegramBotLinkRecord.get( "name" ) );

            this.$refs.dataPanel.ext.getViewModel().set( "editName", true );
        },

        cancelEditName () {
            this.$refs.dataPanel.ext.getViewModel().set( "editName", false );
        },

        async saveName () {
            const name = this.$refs.nameEditField.ext.getValue();

            // form is not valid
            if ( !name ) return this.cancelEditName();

            const res = await this.$api.call( "telegram/bots/links/update-link", this.telegramBotLinkRecord.id, { name } );

            if ( res.ok ) {
                this.telegramBotLinkRecord.set( "name", name );

                this.cancelEditName();

                this.$toast( this.l10n( `Link updated` ) );
            }
            else {
                this.$toast( res );
            }
        },

        beginEditDescription () {
            this.$refs.descriptionEditField.ext.setValue( this.telegramBotLinkRecord.get( "description" ) );

            this.$refs.dataPanel.ext.getViewModel().set( "editDescription", true );
        },

        cancelEditDescription () {
            this.$refs.dataPanel.ext.getViewModel().set( "editDescription", false );
        },

        async saveDescription () {
            const description = this.$refs.descriptionEditField.ext.getValue();

            // form is not valid
            if ( !description ) return this.cancelEditDescription();

            const res = await this.$api.call( "telegram/bots/links/update-link", this.telegramBotLinkRecord.id, { description } );

            if ( res.ok ) {
                this.telegramBotLinkRecord.set( "description", description );

                this.cancelEditDescription();

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

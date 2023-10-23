<template>
    <CardsPanel ref="cardsPanel" @ready="ready">
        <template #dataPanel>
            <ext-panel ref="dataPanel" layout="vbox" padding="0 0 0 10" viewModel="true">
                <ext-toolbar docked="top">
                    <ext-spacer/>
                    <ext-button iconCls="fa-regular fa-copy" :text="l10n(`Copy link`)" @tap="_copyLink"/>
                    <ext-button iconCls="fa-solid fa-redo" :text="l10n(`Refresh`)" @tap="refresh"/>
                </ext-toolbar>

                <ext-displayfield bind="{telegramBotLinkRecord.link}" flex="1" :label="l10n(`Link`)"/>

                <!-- view -->
                <ext-panel bind='{"hidden":"{editStarted}"}' flex="1" layout="vbox">
                    <ext-displayfield bind="{telegramBotLinkRecord.name}" :label="l10n(`Name`)"/>

                    <ext-textareafield bind="{telegramBotLinkRecord.description}" flex="1" :label="l10n(`Description`)" readOnly="true"/>
                </ext-panel>

                <!-- edit -->
                <ext-fieldpanel ref="form" bind='{"hidden":"{!editStarted}"}' flex="1" layout="vbox" trackResetOnLoad="true">
                    <ext-textfield :label="l10n(`Name`)" name="name" required="truw"/>

                    <ext-textareafield flex="1" :label="l10n(`Description`)" name="description"/>
                </ext-fieldpanel>

                <ext-panel defaults='{"labelAlign":"left","labelWidth":150}' padding="0 0 0 10">
                    <ext-displayfield bind="{record.created_html}" :label="l10n(`Creation date`)"/>

                    <ext-displayfield bind="{record.last_user_created_html}" :label="l10n(`Last user created`)" labelAlign="top"/>

                    <ext-displayfield bind="{record.total_users}" :label="l10n(`Total users`)"/>
                    <ext-displayfield bind="{record.total_subscribed_users_text}" :label="l10n(`Total subscribed users`)"/>
                    <ext-displayfield bind="{record.total_unsubscribed_users_text}" :label="l10n(`Total unsubscribed users`)"/>

                    <ext-displayfield bind="{record.total_returned_users_text}" :label="l10n(`Total returned users`)"/>
                    <ext-displayfield bind="{record.total_banned_users_text}" :label="l10n(`Total banned users`)"/>
                </ext-panel>

                <ext-toolbar docked="bottom">
                    <ext-button bind='{"hidden":"{!telegramBotRecord.can_delete_link}"}' iconCls="fa-solid fa-trash-alt" :text="l10n(`Delete`)" ui="decline" @tap="_deleteLink"/>

                    <ext-spacer/>

                    <ext-button bind='{"hidden":"{editButtonHidden}"}' iconCls="fa-solid fa-pen" :text="l10n(`Edit`)" @tap="beginEdit"/>

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

            this.$refs.form.ext.on( "dirtyChange", ( form, dirty ) => {
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

        beginEdit () {
            this.$refs.form.ext.setValues( this.telegramBotLinkRecord.getData() );

            this.$refs.dataPanel.ext.getViewModel().set( "editStarted", true );
        },

        cancelEdit () {
            this.$refs.dataPanel.ext.getViewModel().set( "editStarted", false );
        },

        async updateLink () {
            const form = this.$refs.form.ext;

            // form is not valid
            if ( !form.validate() ) return;

            // data not changed
            if ( !form.dirty ) return this.cancelEdit();

            const res = await this.$api.call( "telegram/bots/links/update-link", this.telegramBotLinkRecord.id, form.getValues() );

            if ( res.ok ) {
                form.fillRecord( this.telegramBotLinkRecord );

                this.cancelEdit();

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

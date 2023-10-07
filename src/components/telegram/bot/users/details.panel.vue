<template>
    <CardsPanel ref="cardsPanel" @ready="ready">
        <template #dataPanel>
            <ext-panel ref="dataPanel" layout="vbox" padding="0 0 0 10" viewModel="true">
                <ext-toolbar docked="top">
                    <ext-spacer/>
                    <ext-button iconCls="fa-solid fa-redo" :text="l10n(`Refresh`)" @tap="refresh"/>
                </ext-toolbar>

                <ext-container layout='{"align":"start","type":"hbox"}'>
                    <ext-displayfield bind="{telegramBotLinkRecord.link}" flex="1" :label="l10n(`Link`)"/>

                    <ext-button iconCls="fa-regular fa-copy" :text="l10n(`Copy link`)" @tap="_copyLink"/>
                </ext-container>

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
export default {
    "props": {
        "telegramBotUserRecord": {
            "type": Object,
            "default": null,
        },
    },

    "watch": {
        telegramBotUserRecord ( newValue, oldValue ) {
            this._onRecordChnge();
        },
    },

    "methods": {
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
    },
};
</script>

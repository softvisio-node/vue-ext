<template>
    <ext-dialog height="80%" layout="vbox" :title="l10n(`vue-ext`, `Edit bot details`)" width="80%" @ready="_ready">
        <ext-fieldpanel ref="fieldPanel" flex="1" layout="vbox" modelValidation="true">
            <ext-textfield :label="l10n(`vue-ext`, `Bot name`)" maxLength="64" name="name"/>

            <ext-textfield :label="l10n(`vue-ext`, `Short description`)" maxLength="120" name="short_description"/>

            <ext-textareafield flex="1" :label="l10n(`vue-ext`, `Description`)" maxLength="512" name="description"/>
        </ext-fieldpanel>

        <ext-toolbar docked="bottom">
            <ext-spacer/>
            <ext-button ref="saveButton" iconCls="fa-solid fa-check" :text="l10nd(`vue-ext`, `Save`)" ui="action" @tap="_save"/>
            <ext-spacer width="20"/>
            <ext-button ref="cancelButton" iconCls="fa-solid fa-xmark" :text="l10nd(`vue-ext`, `Cancel`)" ui="action" @tap="_cancel"/>
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

            this.$refs.fieldPanel.ext.setRecord( this.record );

            cmp.on( "beforeClose", () => {
                if ( this._saving ) return false;
            } );
        },

        _cancel () {
            this.ext.close();
        },

        async _save () {
            this._saving = true;
            this.$refs.cancelButton.ext.disable();
            this.$refs.saveButton.ext.disable();

            const res = await this.$api.call( "telegram/bots/update-bot-details", this.record.id, {
                "name": this.record.get( "name" ),
                "short_description": this.record.get( "short_description" ),
                "description": this.record.get( "description" ),
            } );

            this._saving = false;
            this.$refs.cancelButton.ext.enable();
            this.$refs.saveButton.ext.enable();

            if ( res.ok ) {
                this.$refs.fieldPanel.ext.fillRecord( this.record );

                this.ext.close();
            }
            else {
                this.$utils.toast( res );
            }
        },
    },
};
</script>

<template>
    <ext-dialog height="80%" layout="vbox" :title="l10n(`vue-ext`, `Edit bot details`)" viewModel="true" width="80%" @ready="_ready">
        <ext-fieldpanel flex="1" layout="vbox">
            <ext-textfield bind="{record.name}" :label="l10n(`vue-ext`, `Bot name`)" maxLength="64"/>

            <ext-textfield bind="{record.short_description}" :label="l10n(`vue-ext`, `Short description`)" maxLength="120"/>

            <ext-textareafield bind="{record.description}" flex="1" :label="l10n(`vue-ext`, `Description`)" maxLength="512"/>
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

            cmp.getViewModel().set( "record", this.record );

            cmp.on( "beforeClose", () => {
                if ( this._saving ) return false;

                this.record.reject();
            } );
        },

        _cancel () {
            this.record.reject();

            this.ext.close();
        },

        async _save () {
            this._saving = true;
            this.$refs.cancelButton.ext.disable();
            this.$refs.saveButton.ext.disable();

            const res = await this.$api.call( "telegram/bot/update-details", this.record.id, {
                "name": this.record.get( "name" ),
                "short_description": this.record.get( "short_description" ),
                "description": this.record.get( "description" ),
            } );

            this._saving = false;
            this.$refs.cancelButton.ext.enable();
            this.$refs.saveButton.ext.enable();

            if ( res.ok ) {
                this.record.commit( false, ["name", "short_description", "description"] );

                this.ext.close();
            }
            else {
                this.$utils.toast( res );
            }
        },
    },
};
</script>

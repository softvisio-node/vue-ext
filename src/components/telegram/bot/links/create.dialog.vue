<template>
    <ext-dialog height="500" layout="fit" :title="l10n(`Create Telegram bot link`)" viewModel="true" width="400" @ready="_ready">
        <ext-fieldpanel ref="form" layout="vbox">
            <ext-textfield :label="l10n(`Link name`)" name="name" required="tue"/>

            <ext-textareafield flex="1" :label="l10n(`Link description`)" name="description" wrap="off"/>
        </ext-fieldpanel>

        <ext-toolbar docked="bottom">
            <ext-spacer/>
            <ext-button :text="l10n(`Create link`)" ui="action" @tap="_createLink"/>
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

    "emits": ["create"],

    "methods": {
        _ready ( e ) {
            this.$refs.form.ext.setKeyMap( { "ENTER": this._createLink.bind( this ) } );
        },

        async _createLink () {
            const form = this.$refs.form.ext;

            if ( !form.validate() ) return;

            const values = form.getValues();

            const res = await this.$api.call( "telegram/bots/links/create-link", this.telegramBotId, values );

            if ( !res.ok ) {
                this.$toast( res );
            }
            else {
                this.$emit( "create" );

                this.$toast( this.l10n( `Link created` ) );

                this.ext.close();
            }
        },
    },
};
</script>

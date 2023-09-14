<template>
    <ext-panel ref="form" headerPosition="left" layout="vbox" :title="l10n(`Bot link details`)" @ready="ready">
        <ext-textfield :label="l10n(`Link name`)" name="name" required="tue"/>

        <ext-textareafield flex="1" :label="l10n(`Link description`)" name="description" wrap="off"/>
    </ext-panel>
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
        ready ( e ) {
            const cmp = e.detail.cmp;

            this.ext = cmp;
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

                this.ext.close();
            }
        },
    },
};
</script>

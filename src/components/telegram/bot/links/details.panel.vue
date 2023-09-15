<template>
    <CardsPanel ref="cards" :store="store" @refresh="refresh">
        <template #data>
            <ext-panel ref="form" layout="vbox">
                <ext-textfield :label="l10n(`Link name`)" name="name" required="tue"/>

                <ext-textareafield flex="1" :label="l10n(`Link description`)" name="description" wrap="off"/>
            </ext-panel>
        </template>
    </CardsPanel>
</template>

<script>
import CardsPanel from "#src/components/cards.panel";

export default {
    "components": { CardsPanel },

    "props": {
        "telegramBotLink": {
            "type": Object,
            "default": null,
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
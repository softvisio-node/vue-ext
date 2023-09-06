<template>
    <CharstPanel period="1 hour" :record="record"/>
</template>

<script>
import ChartsDialog from "./charts.dialog";
import CharstPanel from "./charts.panel";

export default {
    "components": { CharstPanel },

    "props": {
        "record": {
            "type": Object,
            "required": true,
        },
    },

    "methods": {
        async _showChartsDialog () {
            if ( !this.record ) return;

            const cmp = await this.$mount( ChartsDialog, {
                "props": {
                    "record": this.record,
                },
            } );

            cmp.ext.show();
        },
    },
};
</script>

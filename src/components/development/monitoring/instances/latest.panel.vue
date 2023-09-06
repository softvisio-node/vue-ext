<template>
    <CharstPanel period="1 hour" :record="record"/>
</template>

<script>
import HistoricalChartsDialog from "./historical.dialog";
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

            const cmp = await this.$mount( HistoricalChartsDialog, {
                "props": {
                    "record": this.record,
                },
            } );

            cmp.ext.show();
        },
    },
};
</script>

<template>
    <CharstPanel period="1 hour" :record="record">
        <template #toolbar>
            <ext-button iconCls="fa-solid fa-expand" :text="l10nd(`vue-ext`, `Open charts`)" @tap="_showChartsDialog"/>
        </template>
    </CharstPanel>
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

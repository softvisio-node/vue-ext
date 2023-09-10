<template>
    <ext-dialog height="90%" layout="fit" scrollable="true" :title="title" viewModel="true" width="90%">
        <CharstPanel period="30 days" :record="record"/>
    </ext-dialog>
</template>

<script>
import CharstPanel from "./charts.panel";

export default {
    "components": { CharstPanel },

    "props": {
        "record": {
            "type": Object,
            "required": true,
        },
    },

    "computed": {
        title () {
            return this.l10n( `Instance stats`, { "domain": "vue-ext" } );
        },
    },

    "methods": {},
};
</script>

<template>
    <ext-dialog :height="height" layout="fit" scrollable="true" :title="i18nd(`vue-ext`, `Administration`)" :width="width">
        <Panel>
            <template #top>
                <slot name="top"/>
            </template>

            <template #bottom>
                <slot name="bottom"/>
            </template>
        </Panel>
    </ext-dialog>
</template>

<script>
import Panel from "./panel";

export default {
    "components": { Panel },

    "props": {
        "width": {
            "type": String,
            "default": "95%",
        },
        "height": {
            "type": String,
            "default": "95%",
        },
    },
};
</script>

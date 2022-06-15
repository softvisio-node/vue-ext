<template>
    <ext-dialog :title="i18nd(`vue-ext`, `Your account`)" :width="width" :height="height" scrollable="true" closeAction="hide" layout="fit">
        <Panel :titles="titles">
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
            "default": "900",
        },
        "height": {
            "type": String,
            "default": "90%",
        },
        "titles": {
            "type": Boolean,
            "default": true,
        },
    },
};
</script>

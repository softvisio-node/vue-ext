<template>
    <ext-dialog title="Your Profile" :width="width" :height="height" scrollable="true" closable="true" draggable="false" closeAction="hide" hideOnMaskTap="true" layout="fit">
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
            "default": "90%",
        },
        "height": {
            "type": String,
            "default": "90%",
        },
        "titles": {
            "type": String,
            "default": "true",
        },
    },
};
</script>

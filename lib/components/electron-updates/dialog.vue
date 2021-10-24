<template>
    <ext-dialog :title="title" :width="width" :height="height" scrollable="true" closeAction="hide" :layout="layout">
        <Panel/>
    </ext-dialog>
</template>

<script>
import Panel from "./panel";

export default {
    "components": { Panel },

    "props": {
        "title": {
            "type": String,
            "default": "Updates",
        },
        "width": {
            "type": String,
            "default": "90%",
        },
        "height": {
            "type": String,
            "default": "90%",
        },
        "layout": {
            "type": String,
            "default": "fit",
        },
    },
};
</script>

<template>
    <ext-dialog title="User Profile" :width="width" :height="height" displayed="true" scrollable="true" closable="true" draggable="false" closeAction="hide" hideOnMaskTap="true" layout="fit">
        <Panel/>
    </ext-dialog>
</template>

<script>
import Panel from "./panel";

export default {
    "components": { Panel },

    "props": {
        "width": {
            "type": String,
            "default": "500",
        },
        "height": {
            "type": String,
            "default": "400",
        },
    },
};
</script>

<template>
    <ext-dialog :title="title" :width="width" :height="height" scrollable="true" closable="true" draggable="false" closeAction="hide" hideOnMaskTap="true" :layout="layout">
        <UsersPanel/>
    </ext-dialog>
</template>

<script>
import UsersPanel from "./panel";

export default {
    "components": { UsersPanel },

    "props": {
        "title": {
            "type": String,
            "default": "Users",
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

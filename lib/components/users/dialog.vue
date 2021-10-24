<template>
    <ext-dialog :title="title" :width="width" :height="height" scrollable="true" closeAction="hide" :layout="layout">
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

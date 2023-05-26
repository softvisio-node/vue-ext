<template>
    <ext-dialog :height="height" :layout="layout" scrollable="true" :title="title" :width="width">
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
            "default": this.i18nd( `vue-ext`, `Users` ),
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

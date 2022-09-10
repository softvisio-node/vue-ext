<template>
    <ext-dialog closeAction="hide" :height="height" layout="fit" scrollable="true" :title="i18nd(`vue-ext`, `Active sessions`)" :width="width">
        <UserSessionsPanel/>
    </ext-dialog>
</template>

<script>
import UserSessionsPanel from "./user-sessions.panel";

export default {
    "components": { UserSessionsPanel },

    "props": {
        "width": {
            "type": String,
            "default": "90%",
        },
        "height": {
            "type": String,
            "default": "90%",
        },
    },
};
</script>

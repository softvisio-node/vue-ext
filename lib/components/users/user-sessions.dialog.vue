<template>
    <ext-dialog closeAction="hide" :height="height" layout="fit" scrollable="true" :title="i18nd(`vue-ext`, `User sessions`)" :width="width">
        <UserSessionsPanel :userId="userId" :username="username"/>
    </ext-dialog>
</template>

<script>
import UserSessionsPanel from "./user-sessions.panel";

export default {
    "components": { UserSessionsPanel },

    "props": {
        "userId": {
            "type": String,
            "required": true,
        },
        "username": {
            "type": String,
            "required": true,
        },
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

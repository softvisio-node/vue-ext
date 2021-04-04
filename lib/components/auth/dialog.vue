<template>
    <ext-dialog bodyPadding="0" draggable="false" closeAction="destroy" :hideOnMaskTap="closable">
        <AuthPanel :signup="signup" :reset="reset" :closable="closable" :shadow="shadow" @close="onClose"/>
    </ext-dialog>
</template>

<script>
import AuthPanel from "./panel";

export default {
    "components": { AuthPanel },

    "props": {
        "signup": {
            "type": String,
            "default": "false",
        },
        "reset": {
            "type": String,
            "default": "true",
        },
        "closable": {
            "type": String,
            "default": "false",
        },
        "shadow": {
            "type": String,
            "default": "true",
        },
    },

    "methods": {
        onClose () {
            this.$unmount();
        },
    },
};
</script>

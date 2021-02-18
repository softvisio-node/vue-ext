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
            "type": Boolean,
            "default": false,
        },
        "reset": {
            "type": Boolean,
            "default": false,
        },
        "closable": {
            "type": Boolean,
            "default": false,
        },
        "shadow": {
            "type": Boolean,
            "default": false,
        },
    },

    "methods": {
        onClose () {
            this.$unmount();
        },
    },
};
</script>

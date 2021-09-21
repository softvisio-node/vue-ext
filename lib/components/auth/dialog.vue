<template>
    <ext-dialog ref="dialog" bodyPadding="0" draggable="false" closeAction="destroy" :hideOnMaskTap="closable">
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
            "default": true,
        },
        "closable": {
            "type": Boolean,
            "default": false,
        },
        "shadow": {
            "type": Boolean,
            "default": true,
        },
    },

    "methods": {
        onClose () {

            // this.$unmount();
            this.$refs.dialog.ext.destroy();
        },
    },
};
</script>

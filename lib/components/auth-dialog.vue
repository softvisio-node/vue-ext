<template>
    <ext-dialog bodyPadding="0" displayed="true" draggable="false" closeAction="destroy" :hideOnMaskTap="closable" @ready="ready">
        <AuthPanel :signup="signup" :recover="recover" :closable="closable" @close="onClose"/>
    </ext-dialog>
</template>

<script>
import AuthPanel from "./auth-panel";

export default {
    "components": { AuthPanel },

    "props": {
        "signup": {
            "type": Boolean,
            "default": false,
        },
        "recover": {
            "type": Boolean,
            "default": false,
        },
        "closable": {
            "type": Boolean,
            "default": false,
        },
    },

    "methods": {
        onClose () {
            this.$destroy();
        },
    },
};
</script>

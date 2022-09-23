<template>
    <ext-dialog bodyPadding="0" :closable="closable">
        <AuthPanel :closable="closable" :errorTarget="errorTarget" :resetPasswordEnabled="resetPasswordEnabled" :shadow="shadow" @close="onClose"/>
    </ext-dialog>
</template>

<script>
import AuthPanel from "./panel";

export default {
    "components": { AuthPanel },

    "props": {
        "errorTarget": {
            "type": String,
            "default": "qtip",
        },
        "resetPasswordEnabled": {
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
            this.ext.close();
        },
    },
};
</script>

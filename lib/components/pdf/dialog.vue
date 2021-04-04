<template>
    <ext-dialog bodyPadding="0" width="90%" height="90%" draggable="false" closeAction="destroy" closable="true" hideOnMaskTap="true" layout="fit">
        <PdfPanel :src="src"/>
    </ext-dialog>
</template>

<script>
import PdfPanel from "./panel";

export default {
    "components": { PdfPanel },

    "props": {
        "src": {
            "type": String,
            "default": null,
        },
        "scale": {
            "type": String,
            "default": "auto",
        },
        "resetZoomOnLoad": {
            "type": String,
            "default": "true",
        },
        "zoomStep": {
            "type": Number,
            "default": 0.1,
        },
        "minZoom": {
            "type": Number,
            "default": 0.5,
        },
        "maxZoom": {
            "type": Number,
            "default": 2,
        },
    },
};
</script>

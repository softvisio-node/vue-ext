<template>
    <ext-image :height="height" :src="src" style="border: 1px solid white; border-radius: 50%" :width="width"/>
</template>

<script>
export default {
    "props": {
        "src": {
            "type": String,
            "default": "",
        },
        "width": {
            "type": String,
            "default": "32",
        },
        "height": {
            "type": String,
            "default": "32",
        },
    },
};
</script>

<template>
    <AvatarImage :height="height" :src="src" :width="width"/>
</template>

<script>
import AvatarImage from "./image";

export default {
    "components": { AvatarImage },

    "props": {
        "width": {
            "type": String,
            "default": "32",
        },
        "height": {
            "type": String,
            "default": "32",
        },
    },

    "computed": {
        src () {
            return this.$app.user.avatar;
        },
    },
};
</script>

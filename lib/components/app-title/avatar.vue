<template>
    <ext-image :src="avatar" :width="width" :height="height" cls="avatar"/>
</template>

<script>
export default {
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
        avatar () {
            return this.$store.session.avatar;
        },
    },
};
</script>

<style>
.avatar {
    border: 1px dashed;
    /* border-radius: 100px; */
}
</style>

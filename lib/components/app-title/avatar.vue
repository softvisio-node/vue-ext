<template>
    <ext-image cls="avatar" :height="height" :src="avatar" style="border: 1px solid; border-radius: 50%" :width="width"/>
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

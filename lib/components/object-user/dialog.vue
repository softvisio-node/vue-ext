<template>
    <ext-dialog height="90%" layout="fit" :title="title" width="700">
        <ObjectUsersPanel ref="panel"/>
    </ext-dialog>
</template>

<script>
import ObjectUsersPanel from "#lib/components/object-user/panel";

export default {
    "components": { ObjectUsersPanel },

    "props": {
        "title": {
            "type": String,
            "default": "Users Roles",
        },
    },

    "methods": {
        setObjectId ( objectId ) {
            this.$refs.panel.setObjectId( objectId );
        },
    },
};
</script>

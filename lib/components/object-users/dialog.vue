<template>
    <ext-dialog :title="title" width="700" height="90%" layout="fit">
        <ObjectUsersPanel ref="panel"/>
    </ext-dialog>
</template>

<script>
import ObjectUsersPanel from "#components/object-users/panel";

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

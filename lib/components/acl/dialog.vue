<template>
    <ext-dialog closeAction="hide" height="90%" layout="fit" :title="titleText" width="800">
        <ObjectUsersPanel ref="panel"/>
    </ext-dialog>
</template>

<script>
import ObjectUsersPanel from "#lib/components/acl/panel";

export default {
    "components": { ObjectUsersPanel },

    "props": {
        "title": {
            "type": String,
            "default": "",
        },
    },

    "computed": {
        titleText () {
            return this.title || this.i18nd( "vue-ext", "Users" );
        },
    },

    "methods": {
        setAclId ( aclId ) {
            this.$refs.panel.setAclId( aclId );
        },
    },
};
</script>

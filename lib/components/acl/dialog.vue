<template>
    <ext-dialog closeAction="hide" height="90%" layout="fit" :title="titleText" width="800">
        <AclPanel ref="panel"/>
    </ext-dialog>
</template>

<script>
import AclPanel from "#lib/components/acl/panel";

export default {
    "components": { AclPanel },

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

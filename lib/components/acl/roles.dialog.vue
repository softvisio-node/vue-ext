<template>
    <ext-dialog height="90%" layout="fit" :title="i18nd(`vue-ext`, `Edit user roles`)" width="600">
        <RolesPanel ref="rolesPanel" :aclId="aclId" :userId="userId" @update="_onRolesUpdate"/>
    </ext-dialog>
</template>

<script>
import RolesPanel from "#lib/components/acl/roles.panel";

export default {
    "components": { RolesPanel },

    "props": {
        "aclId": {
            "type": String,
            "required": true,
        },
        "userRecord": {
            "type": Object,
            "required": true,
        },
    },

    "computed": {
        userId () {
            return this.userRecord.id;
        },
    },

    "methods": {

        // protected
        _onRolesUpdate ( roles ) {
            this.userRecord.set( "roles", roles );
        },
    },
};
</script>

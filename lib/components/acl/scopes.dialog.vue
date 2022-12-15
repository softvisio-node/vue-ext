<template>
    <ext-dialog height="90%" layout="fit" :title="i18nd(`vue-ext`, `Edit user scopes`)" width="800">
        <ScopesPanel ref="scopesPanel" :aclId="aclId" :userId="userId" @update="_onScopesUpdate"/>
    </ext-dialog>
</template>

<script>
import ScopesPanel from "#lib/components/acl/scopes.panel";

export default {
    "components": { ScopesPanel },

    "props": {
        "aclId": {
            "type": String,
            "required": true,
        },
        "user": {
            "type": Object,
            "required": true,
        },
    },

    "computed": {
        userId () {
            return this.user.id;
        },
    },

    "methods": {

        // public
        close () {
            this.ext.hide();
        },

        // protected
        _onScopesUpdate ( scopes ) {
            this.user.set( "scopes", scopes );
        },
    },
};
</script>

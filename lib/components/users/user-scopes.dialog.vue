<template>
    <ext-dialog closeAction="hide" height="90%" layout="fit" :title="i18nd(`vue-ext`, `Edit user scopes`)" width="800">
        <ScopesPanel ref="scopesPanel"/>
    </ext-dialog>
</template>

<script>
import ScopesPanel from "#lib/components/acl/scopes.panel";

export default {
    "components": { ScopesPanel },

    "methods": {
        async setRecord ( record ) {
            this.record = record;

            this.$refs.scopesPanel.setAclUser( -1, record.id );
        },

        close () {
            this.ext.hide();
        },
    },
};
</script>

<template>
    <ext-dialog height="90%" layout="vbox" :title="i18nd(`vue-ext`, `Add user`)" width="800" @ready="_onReady">
        <ext-comboboxfield ref="addUserCombo" displayField="email" forceSelection="true" :label="i18nd(`vue-ext`, `Select user`)" labelAlign="left" labelWidth="150" minChars="1" primaryFilter='{"operator":"like","property":"email"}' triggerAction="query" valueField="id" @ready="_addUserComboReady"/>

        <ext-togglefield ref="enabledField" :label="i18nd(`vue-ext`, `Access enabled`)" labelAlign="left" labelWidth="150" value="true"/>

        <ScopesPanel ref="scopesPanel" flex="1"/>

        <ext-toolbar docked="bottom">
            <ext-spacer/>
            <ext-button :text="i18nd(`vue-ext`, `Add user`)" ui="action" @tap="_addUser"/>
        </ext-toolbar>
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
    },

    "emits": ["create"],

    created () {
        this.store = Ext.create( "Ext.data.Store", {
            "autoLoad": false,
            "pageSize": null,
            "proxy": {
                "api": { "read": "acl/suggest-acl-users" },
            },
            "filters": [
                {
                    "property": "acl_id",
                    "operator": "=",
                    "value": this.aclId,
                },
            ],
        } );
    },

    "methods": {

        // public
        close () {
            this.ext.destroy();
        },

        // protected
        _onReady ( e ) {
            this.$refs.scopesPanel.setAclUser( this.aclId );
        },

        _addUserComboReady ( e ) {
            const cmp = e.detail.cmp;

            cmp.setStore( this.store );
        },

        // XXX
        async _addUser () {},
    },
};
</script>

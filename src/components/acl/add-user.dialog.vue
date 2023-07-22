<template>
    <ext-dialog height="90%" layout="vbox" :title="l10nd(`vue-ext`, `Adding a user`)" width="600">
        <ext-comboboxfield ref="addUserCombo" displayField="email" forceSelection="true" :label="l10nd(`vue-ext`, `Select user`)" labelAlign="left" labelWidth="150" minChars="1" primaryFilter='{"operator":"like","property":"email"}' required="true" triggerAction="query" valueField="id" @ready="_addUserComboReady"/>

        <ext-togglefield ref="enabledField" :label="l10nd(`vue-ext`, `Access enabled`)" labelAlign="left" labelWidth="150" value="true"/>

        <RolesPanel ref="rolesPanel" :aclId="aclId" flex="1"/>

        <ext-toolbar docked="bottom">
            <ext-spacer/>
            <ext-button :text="l10nd(`vue-ext`, `Add user`)" ui="action" @tap="_addUser"/>
        </ext-toolbar>
    </ext-dialog>
</template>

<script>
import RolesPanel from "#src/components/acl/roles.panel";

export default {
    "components": { RolesPanel },

    "props": {
        "aclId": {
            "type": String,
            "required": true,
        },
    },

    "emits": ["add"],

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

        // protected
        _addUserComboReady ( e ) {
            const cmp = e.detail.cmp;

            cmp.setStore( this.store );
        },

        async _addUser () {
            if ( !this.$refs.addUserCombo.ext.validate() ) {
                this.$utils.toast( this.l10nd( `vue-ext`, `Please, correctly fill all required fields` ) );

                return;
            }

            const res = await this.$api.call( "acl/add-acl-user", this.aclId, this.$refs.addUserCombo.ext.getValue(), {
                "enabled": this.$refs.enabledField.ext.getValue(),
                "roles": this.$refs.rolesPanel.getEnabledRoles(),
            } );

            if ( res.ok ) {
                this.$utils.toast( this.l10nd( `vue-ext`, `User added` ) );

                this.$emit( "add" );

                this.ext.close();
            }
            else {
                this.$utils.toast( res );
            }
        },
    },
};
</script>

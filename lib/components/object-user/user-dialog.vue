<template>
    <ext-dialog closeAction="hide" height="500" layout="vbox" :title="i18nd(`vue-ext`, `Add / update user roles`)" viewModel="true" width="700">
        <ext-comboboxfield ref="addUserCombo" displayField="name" forceSelection="true" :label="i18nd(`vue-ext`, `Select user`)" minChars="1" primaryFilter='{"operator":"like","property":"name"}' triggerAction="query" valueField="id" @ready="_addUserComboReady"/>

        <ext-displayfield ref="addUserUsername" :label="i18nd(`vue-ext`, `User`)"/>

        <ext-grid ref="grid" columnMenu="false" columnResize="false" flex="1" itemConfig='{"viewModel":true}' multicolumnSort="true">
            <ext-column cell='{"encodeHtml":false,"style":"vertical-align:top"}' dataIndex="name" flex="1" :text="i18nd(`vue-ext`, `Username`)"/>

            <ext-column sorter='{"property":"enabled"}' :text="i18nd(`vue-ext`, `User enabled`)" width="200" @ready="_enabledColReady"/>
        </ext-grid>

        <ext-toolbar docked="bottom">
            <ext-spacer/>
            <ext-button :text="i18nd(`vue-ext`, `Submit`)" @tap="_addUser"/>
        </ext-toolbar>
    </ext-dialog>
</template>

<script>
import ObjectRoleModel from "#lib/models/object-role";

export default {
    "methods": {
        setRecord ( record ) {
            this.store = Ext.create( "Ext.data.Store", {
                "model": ObjectRoleModel,
                "remoteFilter": false,
                "remoteSort": false,
                "data": record.get( "roles" ),
            } );

            this.$refs.grid.ext.setStore( this.store );

            // this.suggestUsersStore = Ext.create( "Ext.data.Store", {
            //     "autoLoad": false,
            //     "pageSize": null,
            //     "proxy": {
            //         "type": "softvisio",
            //         "api": { "read": "object-user/suggest-users" },
            //     },
            // } );
        },

        _usernameColReady ( e ) {
            const cmp = e.detail.cmp;

            cmp.setRenderer( ( value, record ) => {
                return `
<div class="object-user-username">${record.get( "username" )}</div>
`;
            } );
        },

        _roleColReady ( e ) {
            const cmp = e.detail.cmp;

            cmp.setRenderer( ( value, record ) => {
                return `
<div class="object-user-role-name">${record.get( "role_name" )}</div>
<div class="object-user-role-description">${record.get( "role_description" )}</div>
`;
            } );
        },

        _addUserComboReady ( e ) {
            const cmp = e.detail.cmp;

            cmp.setStore( this.suggestUsersStore );
        },

        async _addUser () {
            const userId = this.$refs.addUserCombo.ext.getValue(),
                roleId = this.$refs.addUserRoleCombo.ext.getValue();

            if ( !userId || !roleId ) {
                this.$utils.toast( this.i18nd( `vue-ext`, `Please, fill all fields` ) );

                return;
            }

            const res = await this.$api.call( "object-user/set-role", this.objectId, userId, roleId );

            if ( !res.ok ) {
                this.$utils.toast( res );
            }
            else {
                this.$utils.toast( this.i18nd( `vue-ext`, `Users updated` ) );

                this.reload();

                this.$refs.addUserDialog.ext.hide();
            }
        },
    },
};
</script>

<style>
.object-user-username {
    font-weight: bold;
    font-size: 1.2em;
}

.object-user-role-name {
    font-weight: bold;
    font-size: 1.2em;
}

.object-user-role-description {
    font-size: 1em;
}
</style>

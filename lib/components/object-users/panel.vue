<template>
    <ext-grid flex="1" itemConfig='{"viewModel":true}' multicolumnSort="true" columnMenu="false" columnResize="false" @ready="_ready">
        <ext-toolbar docked="top">
            <ext-searchfield :placeholder="i18nd(`vue-ext`, `Search users`)" width="200" @change="_searchUsers"/>
            <ext-spacer/>
            <ext-button iconCls="fa-solid fa-plus" :text="i18nd(`vue-ext`, `Add user`)" @tap="_showAddUserDialog"/>
        </ext-toolbar>
        <ext-column width="40" @ready="_avatarColReady"/>
        <ext-column :text="i18nd(`vue-ext`, `Username`)" dataIndex="username" flex="1" cell='{"encodeHtml":false,"style":"vertical-align:top"}' @ready="_usernameColReady"/>
        <ext-column :text="i18nd(`vue-ext`, `Role`)" dataIndex="role_name" flex="1" cell='{"encodeHtml":false}' @ready="_roleColReady"/>
        <ext-column width="100" @ready="_actionColReady"/>

        <!-- add / update user dialog -->
        <ext-dialog ref="addUserDialog" :title="i18nd(`vue-ext`, `Add / update user`)" width="400" height="250" closeAction="hide">
            <ext-comboboxfield ref="addUserCombo" :label="i18nd(`vue-ext`, `Select user`)" valueField="id" displayField="name" primaryFilter='{"property":"name","operator":"like"}' triggerAction="query" minChars="1" forceSelection="true" @ready="_addUserComboReady"/>

            <ext-displayfield ref="addUserUsername" :label="i18nd(`vue-ext`, `User`)"/>

            <ext-comboboxfield ref="addUserRoleCombo" :label="i18nd(`vue-ext`, `Select user role`)" valueField="id" displayField="name" editable="false" queryMode="local" triggerAction="all" itemTpl='<div class="object-user-role-name">{name}</div><div class="object-user-role-description">{description}</div>'/>

            <ext-toolbar docked="bottom">
                <ext-spacer/>
                <ext-button :text="i18nd(`vue-ext`, `Submit`)" @tap="_addUser"/>
            </ext-toolbar>
        </ext-dialog>
    </ext-grid>
</template>

<script>
import ObjectUserModel from "#models/object-user";
import ObjectRoleModel from "#models/object-role";

export default {
    created () {
        this.usersStore = Ext.create( "Ext.data.Store", {
            "model": ObjectUserModel,
            "remoteFilter": false,
            "remoteSort": false,
        } );

        this.rolesStore = Ext.create( "Ext.data.Store", {
            "model": ObjectRoleModel,
        } );

        this.suggestUsersStore = Ext.create( "Ext.data.Store", {
            "pageSize": null,
            "proxy": {
                "type": "softvisio",
                "api": { "read": "object-users/suggest-users" },
            },
        } );
    },

    "methods": {
        setObjectId ( objectId ) {
            this.objectId = objectId;

            this.reload();
        },

        _ready ( e ) {
            const cmp = e.detail.cmp;

            cmp.setStore( this.usersStore );

            this.$refs.addUserDialog.ext.on( "hide", () => {
                this.$refs.addUserCombo.ext.clearValue();
                this.$refs.addUserRoleCombo.ext.clearValue();
            } );
        },

        _avatarColReady ( e ) {
            const cmp = e.detail.cmp;

            cmp.setCell( {
                "xtype": "widgetcell",
                "widget": {
                    "xtype": "img",
                    "height": 36,
                    "bind": { "src": "{record.avatar}" },
                },
            } );
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

        _actionColReady ( e ) {
            var cmp = e.detail.cmp;

            cmp.setCell( {
                "xtype": "widgetcell",
                "widget": {
                    "xtype": "container",
                    "layout": { "type": "hbox", "pack": "end", "align": "center" },
                    "items": [
                        {
                            "xtype": "button",
                            "iconCls": "fa-solid fa-edit",
                            "tooltip": "Change user role",
                            "padding": "0 0 0 3",
                            "handler": this._editUser.bind( this ),
                        },
                        {
                            "xtype": "button",
                            "iconCls": "fa-solid fa-trash-alt",
                            "tooltip": "Delete user",
                            "handler": this._deleteUser.bind( this ),
                        },
                    ],
                },
            } );
        },

        _addUserComboReady ( e ) {
            const cmp = e.detail.cmp;

            cmp.setStore( this.suggestUsersStore );
        },

        async reload () {
            const res = await this.$api.call( "object-users/get-object-users", this.objectId );

            if ( !res.ok ) {
                this.$utils.tolast( res );

                this.rolesStore.loadRawData( [] );
                this.usersStore.loadRawData( [] );
            }
            else {
                this.rolesStore.loadRawData( res.data.roles );
                this.usersStore.loadRawData( res.data.users );
            }
        },

        _searchUsers ( e ) {
            var val = e.detail.newValue.trim();

            if ( val !== "" ) {
                this.usersStore.addFilter(
                    {
                        "property": "username",
                        "operator": "like",
                        "value": val,
                    },
                    false
                );
            }
            else {
                this.usersStore.removeFilter( "username" );
            }
        },

        async _editUser ( button ) {
            const record = button.up( "gridrow" ).getRecord();

            this.$refs.addUserCombo.ext.hide();
            this.$refs.addUserUsername.ext.show();

            this.$refs.addUserCombo.ext.setValue( record.id );
            this.$refs.addUserUsername.ext.setValue( record.get( "username" ) );

            this.$refs.addUserRoleCombo.ext.setStore( this.rolesStore );
            this.$refs.addUserRoleCombo.ext.setValue( record.get( "role_id" ) );

            this.$refs.addUserDialog.ext.show();
        },

        async _deleteUser ( button ) {
            const record = button.up( "gridrow" ).getRecord();

            if ( !( await this.$utils.confirm( this.i18nd( `vue-ext`, "Are you sure you want to delete user?" ) ) ) ) return;

            button.disable();

            var res = await this.$api.call( "object-users/delete-object-user", this.objectId, record.id );

            button.enable();

            if ( res.ok ) {
                this.$utils.toast( this.i18nd( `vue-ext`, "User deleted" ) );

                this.usersStore.remove( record );
            }
            else {
                this.$utils.toast( res );
            }
        },

        _showAddUserDialog () {
            this.$refs.addUserRoleCombo.ext.setStore( this.rolesStore );

            this.$refs.addUserCombo.ext.show();
            this.$refs.addUserUsername.ext.hide();

            this.$refs.addUserDialog.ext.show();
        },

        async _addUser () {
            const userId = this.$refs.addUserCombo.ext.getValue(),
                roleId = this.$refs.addUserRoleCombo.ext.getValue();

            if ( !userId || !roleId ) {
                this.$utils.toast( this.i18nd( `vue-ext`, `Please, fill all fields` ) );

                return;
            }

            const res = await this.$api.call( "object-users/set-object-user-role", this.objectId, userId, roleId );

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

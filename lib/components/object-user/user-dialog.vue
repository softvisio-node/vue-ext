<template>
    <ext-dialog closeAction="hide" height="250" :title="i18nd(`vue-ext`, `Add / update user roles`)" width="400">
        <ext-comboboxfield ref="addUserCombo" displayField="name" forceSelection="true" :label="i18nd(`vue-ext`, `Select user`)" minChars="1" primaryFilter='{"operator":"like","property":"name"}' triggerAction="query" valueField="id" @ready="_addUserComboReady"/>

        <ext-displayfield ref="addUserUsername" :label="i18nd(`vue-ext`, `User`)"/>

        <!-- <ext-comboboxfield ref="addUserRoleCombo" displayField="name" editable="false" itemTpl='<div class="object-user-role-name">{name}</div><div class="object-user-role-description">{description}</div>' :label="i18nd(`vue-ext`, `Select user role`)" queryMode="local" triggerAction="all" valueField="id"/> -->

        <ext-toolbar docked="bottom">
            <ext-spacer/>
            <ext-button :text="i18nd(`vue-ext`, `Submit`)" @tap="_addUser"/>
        </ext-toolbar>
    </ext-dialog>
</template>

<script>
import ObjectUserModel from "#lib/models/object-user";
import ObjectRoleModel from "#lib/models/object-role";

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
            "autoLoad": false,
            "pageSize": null,
            "proxy": {
                "type": "softvisio",
                "api": { "read": "object-user/suggest-users" },
            },
        } );
    },

    "methods": {
        setRecord ( record ) {},

        setObjectId ( objectId ) {
            this.objectId = objectId;

            this.suggestUsersStore.addFilter( {
                "property": "object_id",
                "operator": "=",
                "value": objectId,
            } );

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

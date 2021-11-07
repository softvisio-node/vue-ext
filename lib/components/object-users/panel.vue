<template>
    <ext-grid flex="1" itemConfig='{"viewModel":true}' sortable="false" columnMenu="false" columnResize="false" @ready="_ready">
        <ext-toolbar docked="top">
            <!-- <ext-container html="Notification Types"/> -->
        </ext-toolbar>
        <ext-column width="40" @ready="_avatarColReady"/>
        <ext-column text="Username" dataIndex="username" flex="1" cell='{"encodeHtml":false}'/>
        <ext-column text="Role" dataIndex="role_name" flex="1" cell='{"encodeHtml":false}' @ready="_roleColReady"/>
        <ext-column width="100" @ready="_actionColReady"/>
    </ext-grid>
</template>

<script>
import ObjectUserModel from "#models/object-user";
import ObjectRoleModel from "#models/object-role";

export default {
    created () {
        this.usersStore = Ext.create( "Ext.data.Store", {
            "model": ObjectUserModel,
        } );

        this.rolesStore = Ext.create( "Ext.data.Store", {
            "model": ObjectRoleModel,
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
                            "iconCls": "far fa-trash-alt",
                            "tooltip": "Delete user",
                            "handler": this._deleteUser.bind( this ),
                        },
                    ],
                },
            } );
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

        async _deleteUser ( button ) {
            const record = button.up( "gridrow" ).getRecord();

            if ( !( await this.$utils.confirm( "Confirmation", "Are you sure you want to delete user?" ) ) ) return;

            button.disable();

            var res = await this.$api.call( "object-users/delete-object-user", this.objectId, record.id );

            button.enable();

            if ( res.ok ) {
                this.$utils.toast( "User deleted" );

                this.usersStore.remove( record );
            }
            else {
                this.$utils.toast( res );
            }
        },
    },
};
</script>

<style>
.object-user-role-name {
    font-weight: bold;
    font-size: 1.2em;
}

.object-user-role-description {
    font-size: 1em;
}
</style>

<template>
    <ext-grid ref="grid" layout="fit" plugins='{"gridsummaryrow":true}' multicolumnSort="true" @ready="gridReady">
        <ext-toolbar docked="top">
            <ext-searchfield placeholder="search users" width="200" @change="search"/>
            <ext-spacer/>
            <ext-button iconCls="fas fa-user-plus" text="Create User" padding="0 0 0 5" @tap="showCreateUserDialog"/>
            <ext-button iconCls="fas fa-redo" text="Refresh" @tap="reload"/>
        </ext-toolbar>

        <ext-column width="40" @ready="avatarColReady"/>

        <ext-column text="Name" dataIndex="name" flex="1" summaryDataIndex="total" @ready="nameColReady"/>

        <ext-column text="Created" dataIndex="created" width="150" formatter="date('Y-m-d H:i')"/>

        <ext-column text="Admin" width="95" @ready="adminColReady"/>

        <ext-column text="Enabled" width="95" sorter='{"property":"enabled"}' summaryDataIndex="-" @ready="enabledColReady"/>

        <ext-column width="100" @ready="actionColReady"/>
    </ext-grid>
</template>

<script>
import CreateDialog from "./create/dialog";
import PermissionsDialog from "./permissions/dialog";

export default {
    mounted () {
        this.store = this.$store.users.store;
    },

    "methods": {
        gridReady ( e ) {
            var grid = e.detail.cmp;

            grid.setPlugins( [

                //
                { "type": "gridviewoptions" },
                { "type": "listpaging", "noMoreRecordsText": "", "autoPaging": false },
            ] );

            // grid.setColumnMenu( null );

            grid.setItemConfig( { "viewModel": true } );

            grid.setStore( this.store );

            this.reload();
        },

        avatarColReady ( e ) {
            var cmp = e.detail.cmp;

            cmp.setCell( {
                "xtype": "widgetcell",
                "widget": {
                    "xtype": "img",
                    "height": 36,
                    "bind": { "src": "{record.avatar}" },
                },
            } );
        },

        nameColReady ( e ) {
            var cmp = e.detail.cmp;

            cmp.setCell( { "encodeHtml": false } );

            cmp.setSummaryRenderer( function ( val ) {
                return "Total Users: " + val;
            } );
        },

        adminColReady ( e ) {
            var cmp = e.detail.cmp;

            cmp.setCell( {
                "xtype": "widgetcell",
                "widget": {
                    "xtype": "container",
                    "layout": { "type": "hbox", "pack": "center" },
                    "items": [
                        {
                            "xtype": "togglefield",
                            "bind": { "value": { "bindTo": "{!!record.permissions.admin}", "deep": true } },
                            "listeners": { "change": this.setUserAdmin.bind( this ) },
                        },
                    ],
                },
            } );
        },

        enabledColReady ( e ) {
            var cmp = e.detail.cmp;

            cmp.setCell( {
                "xtype": "widgetcell",
                "widget": {
                    "xtype": "container",
                    "layout": { "type": "hbox", "pack": "center" },
                    "items": [
                        {
                            "xtype": "togglefield",
                            "bind": { "value": "{record.enabled}" },
                            "listeners": { "change": this.setUserEnabled.bind( this ) },
                        },
                    ],
                },
            } );
        },

        actionColReady ( e ) {
            var cmp = e.detail.cmp;

            cmp.setCell( {
                "xtype": "widgetcell",
                "widget": {
                    "xtype": "container",
                    "layout": { "type": "hbox", "pack": "center", "align": "center" },
                    "items": [
                        {
                            "xtype": "button",
                            "iconCls": "fas fa-unlock-alt",
                            "tooltip": "Edit user permissions",
                            "handler": this.showUserPermissionsDialog.bind( this ),
                        },
                        {
                            "xtype": "button",
                            "iconCls": "far fa-trash-alt",
                            "tooltip": "Delete user",
                            "handler": this.deleteUser.bind( this ),
                        },
                        {
                            "xtype": "button",
                            "iconCls": "fas fa-ellipsis-v",
                            "tooltip": "Actions",
                            "arrow": false,
                            "menu": {
                                "items": [
                                    {
                                        "xtype": "button",
                                        "iconCls": "fas fa-sign-out-alt",
                                        "text": "Drop Sessions",
                                        "handler": this.deleteUserSessions.bind( this ),
                                    },
                                ],
                            },
                        },
                    ],
                },
            } );
        },

        async setUserAdmin ( button, newVal, oldVal ) {
            const gridrow = button.up( "gridrow" ),
                record = gridrow.getRecord(),
                userPermissions = record.get( "permissions" ),
                curVal = !!userPermissions.admin;

            if ( newVal === curVal ) return;

            button.disable();

            var res = await this.$api.call( "admin/users/update-permissions", record.get( "id" ), { "admin": newVal } );

            if ( !res.ok ) {
                this.$utils.toast( res );

                await this.$utils.sleep( 1000 );

                button.suspendEvent( "change" );
                userPermissions.admin = curVal;
                button.setValue( curVal );
                button.resumeEvent( "change" );
            }
            else {
                this.$utils.toast( "User permissions updated" );

                userPermissions.admin = newVal;
            }

            button.enable();

            return;
        },

        async setUserEnabled ( button, newVal, oldVal ) {
            const gridrow = button.up( "gridrow" ),
                record = gridrow.getRecord(),
                curVal = record.get( "enabled" );

            if ( newVal === curVal ) return;

            button.disable();

            var res = await this.$api.call( "admin/users/set-enabled", record.get( "id" ), newVal );

            if ( !res.ok ) {
                this.$utils.toast( res );

                await this.$utils.sleep( 1000 );

                button.suspendEvent( "change" );
                record.set( "enabled", oldVal );
                button.enable();
                button.resumeEvent( "change" );
            }
            else {
                this.$utils.toast( `User ${newVal ? "enabled" : "disabled"}` );

                button.enable();
            }

            return;
        },

        async deleteUser ( button ) {
            const gridrow = button.up( "gridrow" ),
                record = gridrow.getRecord();

            if ( !( await this.$utils.confirm( "Confirmation", "Are you sure you want to delete user?" ) ) ) return;

            button.disable();

            var res = await this.$api.call( "admin/users/delete", record.getId() );

            button.enable();

            if ( res.ok ) {
                this.$utils.toast( "User deleted" );

                this.store.remove( record );
            }
            else {
                this.$utils.toast( res );
            }
        },

        async deleteUserSessions ( button ) {
            const gridrow = button.up( "gridrow" ),
                record = gridrow.getRecord();

            button.disable();

            var res = await this.$api.call( "admin/users/delete-sessions", record.getId() );

            button.enable();

            if ( res.ok ) {
                this.$utils.toast( "Sessions were deleted" );
            }
            else {
                this.$utils.toast( res );
            }
        },

        search ( e ) {
            var val = e.detail.newValue.trim();

            if ( val !== "" ) {
                this.store.addFilter( {
                    "property": "search",
                    "operator": "like",
                    "value": val,
                },
                false );
            }
            else {
                this.store.removeFilter( "search" );
            }
        },

        reload () {
            this.$store.users.reload();
        },

        async showCreateUserDialog () {
            const cmp = await this.$mount( CreateDialog );

            cmp.ext.show();
        },

        async showUserPermissionsDialog ( button ) {
            const gridrow = button.up( "gridrow" ),
                record = gridrow.getRecord();

            const cmp = await this.$mount( PermissionsDialog );

            cmp.setRecord( record );

            cmp.ext.show();
        },
    },
};
</script>

<template>
    <ext-grid ref="grid" layout="fit" multicolumnSort="true" plugins='{"gridsummaryrow":true}' @ready="gridReady">
        <ext-toolbar docked="top">
            <ext-searchfield :placeholder="i18nd(`vue-ext`, `Search users`)" width="200" @change="search"/>
            <ext-spacer/>
            <ext-button iconCls="fa-solid fa-user-plus" padding="0 0 0 5" :text="i18nd(`vue-ext`, `Create user`)" @tap="showCreateUserDialog"/>
            <ext-button iconCls="fa-solid fa-redo" :text="i18nd(`vue-ext`, `Refresh`)" @tap="reload"/>
        </ext-toolbar>

        <ext-column width="40" @ready="avatarColReady"/>

        <ext-column dataIndex="name" flex="1" summaryDataIndex="total" :text="i18nd(`vue-ext`, `Username`)" @ready="nameColReady"/>

        <ext-column dataIndex="created" formatter="date()" :text="i18nd(`vue-ext`, `Creation date`)" width="150"/>

        <ext-column :text="i18nd(`vue-ext`, `Administrator`)" width="130" @ready="adminColReady"/>

        <ext-column sorter='{"property":"enabled"}' summaryDataIndex="-" :text="i18nd(`vue-ext`, `Access enabled`)" width="160" @ready="enabledColReady"/>

        <ext-column width="100" @ready="actionColReady"/>
    </ext-grid>
</template>

<script>
import CreateDialog from "./create/dialog";
import RolesDialog from "./roles/dialog";

export default {
    mounted () {
        this.store = this.$store.users.store;
    },

    "methods": {
        gridReady ( e ) {
            var grid = e.detail.cmp;

            grid.setPlugins( ["gridviewoptions", "autopaging"] );

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
                            "iconCls": "fa-solid fa-unlock-alt",
                            "tooltip": this.i18nd( `vue-ext`, "Edit user roles" ),
                            "handler": this.showUserRolesDialog.bind( this ),
                        },
                        {
                            "xtype": "button",
                            "iconCls": "fa-solid fa-trash-alt",
                            "tooltip": this.i18nd( `vue-ext`, "Delete user" ),
                            "handler": this.deleteUser.bind( this ),
                        },
                        {
                            "xtype": "button",
                            "iconCls": "fa-solid fa-ellipsis-v",
                            "tooltip": this.i18nd( `vue-ext`, "Actions" ),
                            "arrow": false,
                            "menu": {
                                "items": [
                                    {
                                        "xtype": "button",
                                        "iconCls": "fa-solid fa-broom",
                                        "text": this.i18nd( `vue-ext`, "Drop sessions" ),
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

            const res = await this.$api.call( "admin/user/update-permissions", record.get( "id" ), { "admin": newVal } );

            button.enable();

            if ( !res.ok ) {
                record.reject();

                this.$utils.toast( res );
            }
            else {
                record.commit();

                this.$utils.toast( this.i18nd( `vue-ext`, "User permissions updated" ) );

                userPermissions.admin = newVal;
            }

            return;
        },

        async setUserEnabled ( button, enabled ) {
            const gridrow = button.up( "gridrow" ),
                record = gridrow.getRecord(),
                curVal = record.get( "enabled" );

            if ( enabled === curVal ) return;

            button.disable();

            const res = await this.$api.call( "admin/user/set-enabled", record.get( "id" ), enabled );

            button.enable();

            if ( !res.ok ) {
                record.reject();

                this.$utils.toast( res );
            }
            else {
                record.commit();

                this.$utils.toast( enabled ? this.i18nd( `vue-ext`, `Access enabled` ) : this.i18nd( `vue-ext`, `Access disabled` ) );
            }
        },

        async deleteUser ( button ) {
            const gridrow = button.up( "gridrow" ),
                record = gridrow.getRecord();

            if ( !( await this.$utils.confirm( this.i18nd( `vue-ext`, "Are you sure you want to delete user?" ) ) ) ) return;

            button.disable();

            var res = await this.$api.call( "admin/user/delete", record.getId() );

            button.enable();

            if ( res.ok ) {
                this.$utils.toast( this.i18nd( `vue-ext`, "User deleted" ) );

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

            var res = await this.$api.call( "admin/user/delete-sessions", record.getId() );

            button.enable();

            if ( res.ok ) {
                this.$utils.toast( this.i18nd( `vue-ext`, "Sessions were deleted" ) );
            }
            else {
                this.$utils.toast( res );
            }
        },

        search ( e ) {
            var val = e.detail.newValue.trim();

            if ( val !== "" ) {
                this.store.addFilter(
                    {
                        "property": "search",
                        "operator": "like",
                        "value": val,
                    },
                    false
                );
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

        async showUserRolesDialog ( button ) {
            const gridrow = button.up( "gridrow" ),
                record = gridrow.getRecord();

            const cmp = await this.$mount( RolesDialog );

            cmp.setRecord( record );

            cmp.ext.show();
        },
    },
};
</script>

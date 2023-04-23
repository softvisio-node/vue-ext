<template>
    <CardsPanel ref="cards" :store="store" viewModel="true" @reload="reload">
        <template #items>
            <ext-toolbar docked="top">
                <ext-searchfield :placeholder="i18nd(`vue-ext`, `Search users`)" width="200" @change="_searchUsers"/>
                <RolesButton :aclId="aclId" @change="_onRolesFilterChange"/>
                <ext-spacer/>
                <ext-button bind='{"hidden":"{!permissions.create}"}' iconCls="fa-solid fa-plus" :text="i18nd(`vue-ext`, `Add user`)" @tap="_showAddUserDialog"/>
                <ext-button iconCls="fa-solid fa-redo" :text="i18nd(`vue-ext`, `Refresh`)" @tap="reload"/>
            </ext-toolbar>
        </template>

        <template #data>
            <ext-grid ref="grid" columnMenu="false" columnResize="false" itemConfig='{"viewModel":true}' multicolumnSort="true" plugins='["gridviewoptions", "autopaging"]' viewModel="true" @ready="_onReady">
                <ext-column width="40" @ready="_avatarColReady"/>

                <ext-column cell='{"style":"vertical-align:top"}' dataIndex="email" flex="1" :text="i18nd(`vue-ext`, `Email`)"/>

                <ext-column cell='{"encodeHtml":false}' dataIndex="roles" flex="1" sortable="false" :text="i18nd(`vue-ext`, `Roles`)" @ready="_rolesColReady"/>

                <ext-column sorter='{"property":"enabled"}' :text="i18nd(`vue-ext`, `Access enabled`)" width="160" @ready="_enabledColReady"/>

                <ext-column width="80" @ready="_actionColReady"/>
            </ext-grid>
        </template>
    </CardsPanel>
</template>

<script>
import "#src/components/avatar/ext.avatar";
import PermissionModel from "./models/permission";
import UserModel from "./models/user";
import AddUserDialog from "./add-user.dialog";
import CardsPanel from "#src/components/cards.panel";
import RolesButton from "#src/components/acl/roles.button";
import RolesDialog from "#src/components/acl/roles.dialog";

export default {
    "components": { CardsPanel, RolesButton },

    "props": {
        "aclId": {
            "type": String,
            "required": true,
        },
    },

    created () {
        this.store = Ext.create( "Ext.data.Store", {
            "model": UserModel,
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
        async reload () {
            var res;

            // load permissions
            if ( !this._permissionsLoaded ) {
                this.$refs.cards.mask();

                res = await this.$api.call( "acl/get-acl-user-permissions", this.aclId );

                if ( res.ok ) {
                    this._permissionsLoaded = true;

                    this.$refs.cards.ext.getViewModel().get( "permissions" ).set( "permissions", res.data );
                }
                else {
                    this.$refs.cards.ext.getViewModel().get( "permissions" ).set( "permissions", [] );
                }
            }

            // load roles
            if ( !this._rolesLoaded ) {
                this.$refs.cards.mask();

                res = await this.$api.call( "acl/get-acl-roles", this.aclId );

                if ( res.ok ) {
                    this._rolesLoaded = true;

                    this.roles = {};

                    for ( const role of res.data ) {
                        this.roles[role.id] = role.name;
                    }
                }
            }

            this.$refs.cards.unmask();

            // error
            if ( res && !res.ok ) {
                this.$refs.cards.setResult( res );

                this.$utils.toast( res );

                return;
            }

            // reload users
            this.store.loadPage( 1 );
        },

        // protected
        _onReady ( e ) {
            const cmp = e.detail.cmp;

            const permissions = new PermissionModel( { "permissions": [] } );

            this.$refs.cards.ext.getViewModel().set( "permissions", permissions );
            this.$refs.grid.ext.getViewModel().set( "permissions", permissions );

            cmp.setStore( this.store );

            this.reload();
        },

        _avatarColReady ( e ) {
            const cmp = e.detail.cmp;

            cmp.setCell( {
                "xtype": "widgetcell",
                "widget": {
                    "xtype": "avatar",
                    "bind": "{record.avatar}",
                },
            } );
        },

        _enabledColReady ( e ) {
            const cmp = e.detail.cmp;

            cmp.setCell( {
                "xtype": "widgetcell",
                "widget": {
                    "xtype": "container",
                    "layout": { "type": "hbox", "pack": "center" },
                    "items": [
                        {
                            "xtype": "togglefield",
                            "bind": {
                                "value": "{record.enabled}",
                                "disabled": "{!permissions.update}",
                            },
                            "listeners": { "change": this._setAclUserEnabled.bind( this ) },
                        },
                    ],
                },
            } );
        },

        _rolesColReady ( e ) {
            const cmp = e.detail.cmp;

            cmp.setRenderer( ( value, record ) => {
                if ( !value ) {
                    return "&mdash;";
                }
                else {
                    return value.map( role => this.roles[role] ).join( ", " );
                }
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
                            "iconCls": "fa-solid fa-unlock-alt",
                            "tooltip": this.i18nd( "vue-ext", "Edit user roles" ),
                            "padding": "0 0 0 3",
                            "handler": this._showUserRolesDialog.bind( this ),
                            "bind": {
                                "disabled": "{!permissions.update}",
                            },
                        },
                        {
                            "xtype": "button",
                            "iconCls": "fa-solid fa-trash-alt",
                            "tooltip": this.i18nd( "vue-ext", "Delete user" ),
                            "handler": this._deleteAclUser.bind( this ),
                            "bind": {
                                "disabled": "{!permissions.delete}",
                            },
                        },
                    ],
                },
            } );
        },

        _searchUsers ( e ) {
            var val = e.detail.newValue.trim();

            if ( val !== "" ) {
                this.store.addFilter( {
                    "property": "email",
                    "operator": "like",
                    "value": val,
                } );
            }
            else {
                this.store.removeFilter( "email" );
            }
        },

        async _setAclUserEnabled ( button, enabled ) {
            const record = button.up( "gridrow" ).getRecord();

            if ( enabled === record.get( "enabled" ) ) return;

            button.disable();

            const res = await this.$api.call( "acl/set-acl-user-enabled", this.aclId, record.id, enabled );

            if ( !res.ok ) {
                await this.$utils.sleep( 500 );

                record.set( "enabled", !enabled );

                this.$utils.toast( res );
            }
            else {
                record.commit();

                this.$utils.toast( enabled ? this.i18nd( `vue-ext`, `Access enabled` ) : this.i18nd( `vue-ext`, `Access disabled` ) );
            }

            button.enable();
        },

        async _deleteAclUser ( button ) {
            const record = button.up( "gridrow" ).getRecord();

            if ( !( await this.$utils.confirm( this.i18nd( `vue-ext`, "Are you sure you want to delete user?" ) ) ) ) return;

            button.disable();

            var res = await this.$api.call( "acl/delete-acl-user", this.aclId, record.id );

            button.enable();

            if ( res.ok ) {
                this.$utils.toast( this.i18nd( `vue-ext`, "User deleted" ) );

                this.store.remove( record );
            }
            else {
                this.$utils.toast( res );
            }
        },

        async _showUserRolesDialog ( button ) {
            const record = button.up( "gridrow" ).getRecord();

            const cmp = await this.$mount( RolesDialog, {
                "props": {
                    "aclId": this.aclId,
                    "userRecord": record,
                },
            } );

            cmp.ext.show();
        },

        async _showAddUserDialog () {
            const cmp = await this.$mount( AddUserDialog, {
                "props": {
                    "aclId": this.aclId,
                    "onAdd": () => this.reload(),
                },
            } );

            cmp.ext.show();
        },

        _onRolesFilterChange ( roles ) {
            if ( roles ) {
                this.store.addFilter( {
                    "property": "roles",
                    "operator": "in",
                    "value": roles,
                } );
            }
            else {
                this.store.removeFilter( "roles" );
            }
        },
    },
};
</script>

<template>
    <CardsPanel ref="cards" :store="store" @reload="reload" @storeLoad="_onStoreLoad">
        <template #items>
            <ext-toolbar docked="top">
                <ext-searchfield :placeholder="i18nd(`vue-ext`, `Search users`)" width="200" @change="search"/>
                <RolesButton aclId="aclId" @change="_onRolesFilterChange"/>
                <ext-spacer/>
                <ext-button :disabled="!canCreateUser" iconCls="fa-solid fa-user-plus" padding="0 0 0 5" :text="i18nd(`vue-ext`, `Create user`)" @tap="showCreateUserDialog"/>
                <ext-button iconCls="fa-solid fa-redo" :text="i18nd(`vue-ext`, `Refresh`)" @tap="reload"/>
            </ext-toolbar>
        </template>

        <template #data>
            <ext-grid itemConfig='{"viewModel":true}' layout="fit" multicolumnSort="true" plugins='["gridviewoptions", "autopaging"]' @ready="_onGridReady">
                <ext-column width="40" @ready="_avatarColReady"/>

                <ext-column dataIndex="email" flex="1" :text="i18nd(`vue-ext`, `Email`)" @ready="_emailColReady"/>

                <ext-column cell='{"encodeHtml":false}' dataIndex="roles" flex="1" sortable="false" :text="i18nd(`vue-ext`, `Roles`)" @ready="_rolesColReady"/>

                <ext-column cell='{"encodeHtml":false}' dataIndex="last_activity_text" :hidden="lastActivityColumnHidden" sorter='{"property":"last_activity"}' :text="i18nd(`vue-ext`, `Last activity`)" width="150"/>

                <ext-column dataIndex="created" formatter="date()" :hidden="createdColumnHidden" :text="i18nd(`vue-ext`, `Creation date`)" width="150"/>

                <ext-column sorter='{"property":"enabled"}' :text="i18nd(`vue-ext`, `Access enabled`)" width="160" @ready="_enabledColReady"/>

                <ext-column width="80" @ready="_actionColReady"/>
            </ext-grid>
        </template>
    </CardsPanel>
</template>

<script>
import constants from "#core/app/constants";
import "#src/components/avatar/ext.avatar";
import CreateUserDialog from "./create-user.dialog";
import UserRolesDialog from "#src/components/acl/roles.dialog";
import UserModel from "./models/user";
import ChangePasswordDialog from "./change-password.dialog";
import UserSessionsDialog from "./user-sessions.dialog";
import CardsPanel from "#src/components/cards.panel";
import RolesButton from "#src/components/acl/roles.button";

export default {
    "components": { CardsPanel, RolesButton },

    "props": {
        "lastActivityColumnHidden": {
            "type": Boolean,
            "default": false,
        },
        "createdColumnHidden": {
            "type": Boolean,
            "default": false,
        },
    },

    data () {
        return {
            "aclId": constants.defaultAclId,

            "canCreateUser": this.$app.hasPermissions( "admin:create" ),
            "canUpdateUser": this.$app.hasPermissions( "admin:update" ),
            "canDeleteUser": this.$app.hasPermissions( "admin:delete" ),
            "canUpdateUserRoles": this.$app.hasPermissions( "admin:update" ) && this.$app.hasPermissions( "acl:update" ),
        };
    },

    created () {
        this.store = Ext.create( "Ext.data.Store", {
            "model": UserModel,
            "autoLoad": false,
            "pageSize": 50,
        } );
    },

    "methods": {

        // public
        async reload () {
            var res;

            // load roles
            if ( !this._rolesLoaded ) {
                this.$refs.cards.mask();

                res = await this.$api.call( "acl/get-acl-roles", constants.defaultAclId );

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

            this.$refs.cards.mask();

            this.store.loadPage( 1 );
        },

        // protected
        _onGridReady ( e ) {
            const cmp = e.detail.cmp;

            // cmp.setColumnMenu( null );

            cmp.setStore( this.store );

            this.reload();
        },

        _avatarColReady ( e ) {
            var cmp = e.detail.cmp;

            cmp.setCell( {
                "xtype": "widgetcell",
                "widget": {
                    "xtype": "avatar",
                    "bind": "{record.avatar}",
                },
            } );
        },

        _emailColReady ( e ) {
            const cmp = e.detail.cmp;

            cmp.setCell( { "encodeHtml": false } );
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

        _enabledColReady ( e ) {
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
                            "disabled": !this.canUpdateUser,
                        },
                    ],
                },
            } );
        },

        _actionColReady ( e ) {
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
                            "disabled": !this.canUpdateUserRoles,
                        },
                        {
                            "xtype": "button",
                            "iconCls": "fa-solid fa-ellipsis-v",
                            "tooltip": this.i18nd( `vue-ext`, "Actions" ),
                            "arrow": false,
                            "menu": {
                                "defaults": {
                                    "xtype": "menuitem",
                                },
                                "items": [
                                    {
                                        "iconCls": "fa-solid fa-copy",
                                        "text": this.i18nd( `vue-ext`, "Copy email to the clipboard" ),
                                        "handler": this._copyEmail.bind( this ),
                                    },
                                    {
                                        "text": this.i18nd( `vue-ext`, "View user sessions" ),
                                        "handler": this._showUserSessionsDialog.bind( this ),
                                    },
                                    {
                                        "text": this.i18nd( `vue-ext`, "Change password" ),
                                        "handler": this._showChangePasswordDialog.bind( this ),
                                        "disabled": !this.canUpdateUser,
                                    },
                                    {
                                        "separator": true,
                                        "iconCls": "fa-solid fa-trash-alt",
                                        "text": this.i18nd( `vue-ext`, "Delete user" ),
                                        "handler": this.deleteUser.bind( this ),
                                        "disabled": !this.canDeleteUser,
                                    },
                                ],
                            },
                        },
                    ],
                },
            } );
        },

        async setUserEnabled ( button, enabled ) {
            const gridrow = button.up( "gridrow" ),
                record = gridrow.getRecord(),
                curVal = record.get( "enabled" );

            if ( enabled === curVal ) return;

            button.disable();

            const res = await this.$api.call( "admin/users/set-enabled", record.get( "id" ), enabled );

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

        async deleteUser ( button ) {
            const gridrow = button.up( "gridrow" ),
                record = gridrow.getRecord();

            if ( !( await this.$utils.confirm( this.i18nd( `vue-ext`, "Are you sure you want to delete user?" ) ) ) ) return;

            button.disable();

            var res = await this.$api.call( "admin/users/delete", record.getId() );

            button.enable();

            if ( res.ok ) {
                this.$utils.toast( this.i18nd( `vue-ext`, "User deleted" ) );

                this.store.remove( record );
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
                } );
            }
            else {
                this.store.removeFilter( "search" );
            }
        },

        _onStoreLoad () {
            this.$refs.cards.unmask();
        },

        async showCreateUserDialog () {
            const cmp = await this.$mount( CreateUserDialog, {
                "props": {
                    "onCreated": () => this.reload(),
                },
            } );

            cmp.ext.show();
        },

        async showUserRolesDialog ( button ) {
            const gridrow = button.up( "gridrow" ),
                record = gridrow.getRecord();

            const cmp = await this.$mount( UserRolesDialog, {
                "props": {
                    "aclId": constants.defaultAclId,
                    "userRecord": record,
                },
            } );

            cmp.ext.show();
        },

        async _showChangePasswordDialog ( button ) {
            const record = button.lookupViewModel().get( "record" );

            const cmp = await this.$mount( ChangePasswordDialog, {
                "props": {
                    "userId": record.id,
                    "userEmail": record.get( "email" ),
                },
            } );

            cmp.ext.show();
        },

        async _showUserSessionsDialog ( button ) {
            const record = button.lookupViewModel().get( "record" );

            const cmp = await this.$mount( UserSessionsDialog, {
                "props": {
                    "userId": record.id,
                    "userEmail": record.get( "email" ),
                },
            } );

            cmp.ext.show();
        },

        _copyEmail ( button ) {
            const record = button.lookupViewModel().get( "record" );

            this.$utils.copyToClipboard( record.get( "email" ) );

            this.$utils.toast( this.i18nd( `vue-ext`, `User email copied` ) );
        },

        // roles filter
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

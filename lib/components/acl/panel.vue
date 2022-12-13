<template>
    <CardsPanel ref="cards" :store="store" viewModel="true" @reload="reload">
        <template #items>
            <ext-toolbar docked="top">
                <ext-searchfield :placeholder="i18nd(`vue-ext`, `Search users`)" width="200" @change="_searchUsers"/>
                <ScopesButton :aclId="aclId" @change="_onScopesFilterChange"/>
                <ext-spacer/>
                <ext-button bind='{"hidden":"{!acl.can_add_user}"}' iconCls="fa-solid fa-plus" :text="i18nd(`vue-ext`, `Add user`)" @tap="_addUser"/>
                <ext-button iconCls="fa-solid fa-redo" :text="i18nd(`vue-ext`, `Refresh`)" @tap="reload"/>
            </ext-toolbar>
        </template>

        <template #data>
            <ext-grid ref="grid" columnMenu="false" columnResize="false" itemConfig='{"viewModel":true}' multicolumnSort="true" viewModel="true" @ready="_ready">
                <ext-column width="40" @ready="_avatarColReady"/>

                <ext-column cell='{"style":"vertical-align:top"}' dataIndex="email" flex="1" :text="i18nd(`vue-ext`, `Email`)"/>

                <ext-column dataIndex="scopes" flex="1" sortable="false" :text="i18nd(`vue-ext`, `Scopes`)" @ready="_scopesColReady"/>

                <ext-column sorter='{"property":"enabled"}' :text="i18nd(`vue-ext`, `Access enabled`)" width="160" @ready="_enabledColReady"/>

                <ext-column width="80" @ready="_actionColReady"/>
            </ext-grid>
        </template>
    </CardsPanel>
</template>

<script>
import "#lib/components/avatar/ext.avatar";
import PermissionModel from "./models/permission";
import UserModel from "./models/user";
import UserDialog from "./user-dialog";
import CardsPanel from "#lib/components/cards.panel";
import ScopesButton from "#lib/components/acl/scopes.button";

export default {
    "components": { CardsPanel, ScopesButton },

    data () {
        return {
            "aclId": "",
        };
    },

    created () {
        this.store = Ext.create( "Ext.data.Store", {
            "model": UserModel,
        } );
    },

    "methods": {

        // public
        // XXX drop search filter
        setAclId ( aclId ) {
            if ( this.aclId === aclId ) {
                return;
            }
            else {

                // cleat store
                this.store.loadRawData( [] );

                this._scopesLoaded = false;
                this._permissionsLoaded = false;

                this.aclId = aclId;

                this.store.clearFilter( true );

                this.store.addFilter(
                    {
                        "property": "acl_id",
                        "operator": "=",
                        "value": this.aclId,
                    },
                    true
                );

                this.reload();
            }
        },

        async reload () {
            if ( !this.aclId ) return;

            if ( !this.isReady ) return;

            var res;

            // load scopes
            if ( !this._scopesLoaded ) {
                this.$refs.cards.mask();

                res = await this.$api.call( "acl/get-acl-scopes", this.aclId );

                if ( res.ok ) {
                    this._scopesLoaded = true;

                    this.scopes = {};

                    for ( const scope of res.data ) {
                        this.scopes[scope.id] = scope.name;
                    }
                }
            }

            // load permissions
            if ( !this._permissionsLoaded ) {
                this.$refs.cards.mask();

                res = await this.$api.call( "acl/get-acl-user-permissions", this.aclId );

                if ( res.ok ) {
                    this._permissionsLoaded = true;

                    const acl = new PermissionModel( { "permissions": res.data } );
                    this.$refs.grid.ext.getViewModel().set( "acl", acl );
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
        _ready ( e ) {
            this.isReady = true;

            this.$refs.grid.ext.setStore( this.store );

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

                                // "disabled": "{!record.can_set_enabled}",
                            },
                            "listeners": { "change": this._setAclUserEnabled.bind( this ) },
                        },
                    ],
                },
            } );
        },

        _scopesColReady ( e ) {
            const cmp = e.detail.cmp;

            cmp.setRenderer( ( value, record ) => {
                if ( !value ) {
                    return this.i18nd( "vue-ext", `No scopes assigned` );
                }
                else {
                    return value.map( scope => this.scopes[scope] ).join( ", " );
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
                            "tooltip": this.i18nd( "vue-ext", "Edit user scopes" ),
                            "padding": "0 0 0 3",
                            "handler": this._editUser.bind( this ),

                            // "bind": {
                            //     "disabled": "{!record.can_edit_roles}",
                            // },
                        },
                        {
                            "xtype": "button",
                            "iconCls": "fa-solid fa-trash-alt",
                            "tooltip": this.i18nd( "vue-ext", "Delete user" ),
                            "handler": this._deleteAclUser.bind( this ),

                            // "bind": {
                            //     "disabled": "{!record.can_delete}",
                            // },
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

        async _editUser ( button ) {
            const record = button.up( "gridrow" ).getRecord();

            this._showUserDialog( record );
        },

        // XXX
        async _addUser () {
            this.$refs.cards.mask();

            const res = await this.$api.call( "acl/get-roles", this.aclId );

            this.$refs.cards.unmask();

            if ( !res.ok ) {
                this.$utils.toast( res );
            }
            else {
                const record = new UserModel( {
                    "roles": res.data,
                } );

                this._showUserDialog( record );
            }
        },

        async _showUserDialog ( record ) {
            const cmp = await this.$mount( UserDialog, {
                "props": { "onReload": () => this.reload() },
            } );

            cmp.setRecord( record, this.aclId );

            cmp.ext.show();
        },

        _onScopesFilterChange ( scopes ) {
            if ( scopes ) {
                this.store.addFilter( {
                    "property": "scopes",
                    "operator": "in",
                    "value": scopes,
                } );
            }
            else {
                this.store.removeFilter( "scopes" );
            }
        },
    },
};
</script>

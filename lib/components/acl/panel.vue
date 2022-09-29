<template>
    <CardsErrorPanel ref="cards" :store="store" @reload="reload">
        <template #items>
            <ext-toolbar docked="top">
                <ext-searchfield :placeholder="i18nd(`vue-ext`, `Search users`)" width="200" @change="_searchUsers"/>
                <ext-spacer/>
                <ext-button bind='{"hidden":"{!acl.can_add_user}"}' iconCls="fa-solid fa-plus" :text="i18nd(`vue-ext`, `Add user`)" @tap="_addUser"/>
                <ext-button iconCls="fa-solid fa-redo" :text="i18nd(`vue-ext`, `Refresh`)" @tap="reload"/>
            </ext-toolbar>
        </template>

        <template #data>
            <ext-grid ref="grid" columnMenu="false" columnResize="false" itemConfig='{"viewModel":true}' multicolumnSort="true" viewModel="true" @ready="_ready">
                <ext-column width="40" @ready="_avatarColReady"/>

                <ext-column cell='{"style":"vertical-align:top"}' dataIndex="email" flex="1" :text="i18nd(`vue-ext`, `Email`)"/>

                <ext-column cell='{"encodeHtml":false}' dataIndex="roles_text" flex="1" :text="i18nd(`vue-ext`, `Roles`)"/>

                <ext-column sorter='{"property":"enabled"}' :text="i18nd(`vue-ext`, `Access enabled`)" width="160" @ready="_enabledColReady"/>

                <ext-column width="80" @ready="_actionColReady"/>
            </ext-grid>
        </template>
    </CardsErrorPanel>
</template>

<script>
import "#lib/components/avatar/ext.avatar";
import AclModel from "./models/acl";
import UserModel from "./models/user";
import UserDialog from "./user-dialog";
import CardsErrorPanel from "#lib/components/cards-error.panel";

export default {
    "components": { CardsErrorPanel },

    created () {
        this.store = Ext.create( "Ext.data.Store", {
            "model": UserModel,
            "remoteFilter": false,
            "remoteSort": false,
        } );
    },

    "methods": {
        _ready ( e ) {
            this.$refs.grid.ext.setStore( this.store );
        },

        setAclId ( aclId ) {
            this.aclId = aclId;

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
                                "disabled": "{!record.can_set_enabled}",
                            },
                            "listeners": { "change": this._setUserEnabled.bind( this ) },
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
                    "layout": { "type": "hbox", "pack": "end", "align": "center" },
                    "items": [
                        {
                            "xtype": "button",
                            "iconCls": "fa-solid fa-unlock-alt",
                            "tooltip": this.i18nd( "vue-ext", "Edit user roles" ),
                            "padding": "0 0 0 3",
                            "handler": this._editUser.bind( this ),
                            "bind": {
                                "disabled": "{!record.can_edit_roles}",
                            },
                        },
                        {
                            "xtype": "button",
                            "iconCls": "fa-solid fa-trash-alt",
                            "tooltip": this.i18nd( "vue-ext", "Delete user" ),
                            "handler": this._deleteUser.bind( this ),
                            "bind": {
                                "disabled": "{!record.can_delete}",
                            },
                        },
                    ],
                },
            } );
        },

        async reload () {
            this.$refs.cards.mask();

            this.store.loadRawData( [] );

            var res = await this.$api.call( "acl/get-acl-permissions", this.aclId, "acl" );

            if ( !res.ok ) {
                this.$refs.cards.unmask();

                this.$refs.cards.setResult( res );

                this.$utils.toast( res );
            }

            const acl = new AclModel( res.data );
            this.$refs.grid.ext.getViewModel().set( "acl", acl );

            res = await this.$api.call( "acl/get-users", this.aclId );

            this.$refs.cards.unmask();

            if ( !res.ok ) {
                this.$refs.cards.setResult( res );

                this.$utils.toast( res );
            }
            else {
                this.store.loadRawData( res.data );
            }
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

        async _setUserEnabled ( button, enabled ) {
            const record = button.up( "gridrow" ).getRecord();

            if ( enabled === record.get( "enabled" ) ) return;

            button.disable();

            const res = await this.$api.call( "acl/set-user-enabled", this.aclId, record.id, enabled );

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

        async _deleteUser ( button ) {
            const record = button.up( "gridrow" ).getRecord();

            if ( !( await this.$utils.confirm( this.i18nd( `vue-ext`, "Are you sure you want to delete user?" ) ) ) ) return;

            button.disable();

            var res = await this.$api.call( "acl/delete-user", this.aclId, record.id );

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
    },
};
</script>

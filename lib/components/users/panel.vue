<template>
    <CardsErrorPanel ref="cards" :store="store" @reload="reload" @storeLoad="_onStoreLoad">
        <template #items>
            <ext-toolbar docked="top">
                <ext-searchfield :placeholder="i18nd(`vue-ext`, `Search users`)" width="200" @change="search"/>
                <ext-button ref="rolesFilter" width="120"/>
                <ext-spacer/>
                <ext-button iconCls="fa-solid fa-user-plus" padding="0 0 0 5" :text="i18nd(`vue-ext`, `Create user`)" @tap="showCreateUserDialog"/>
                <ext-button iconCls="fa-solid fa-redo" :text="i18nd(`vue-ext`, `Refresh`)" @tap="reload"/>
            </ext-toolbar>
        </template>

        <template #data>
            <ext-grid layout="fit" multicolumnSort="true" plugins='{"gridsummaryrow":true}' @ready="_gridReady">
                <ext-column width="40" @ready="_avatarColReady"/>

                <ext-column dataIndex="email" flex="1" summaryDataIndex="total" :text="i18nd(`vue-ext`, `Email`)" @ready="_emailColReady"/>

                <ext-column cell='{"encodeHtml":false}' dataIndex="last_activity_text" :hidden="lastActivityColumnHidden" sorter='{"property":"last_activity"}' :text="i18nd(`vue-ext`, `Last activity`)" width="150"/>

                <ext-column dataIndex="created" formatter="date()" :hidden="createdColumnHidden" :text="i18nd(`vue-ext`, `Creation date`)" width="150"/>

                <ext-column sorter='{"property":"enabled"}' summaryDataIndex="-" :text="i18nd(`vue-ext`, `Access enabled`)" width="160" @ready="_enabledColReady"/>

                <ext-column width="80" @ready="_actionColReady"/>
            </ext-grid>
        </template>
    </CardsErrorPanel>
</template>

<script>
import "#lib/components/avatar/ext.avatar";
import CreateUserDialog from "./create-user.dialog";
import UserRolesDialog from "./user-roles.dialog";
import UserModel from "./models/user";
import ChangePasswordDialog from "./change-password.dialog";
import UserSessionsDialog from "./user-sessions.dialog";
import CardsErrorPanel from "#lib/components/cards-error.panel";

export default {
    "components": { CardsErrorPanel },

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

    created () {
        this.store = Ext.create( "Ext.data.Store", {
            "model": UserModel,
            "autoLoad": false,
            "pageSize": 50,
        } );
    },

    "methods": {
        _gridReady ( e ) {
            const rolesFilter = this.$refs.rolesFilter.ext;

            rolesFilter.setText( this.i18nd( "vue-ext", "Roles" ) );

            rolesFilter.setMenu( [
                {
                    "xtype": "menucheckitem",
                    "id": "admin",
                    "text": "Administrators",
                    "listeners": {
                        "checkchange": this._rolesFilterChange.bind( this ),
                    },
                },
                { "xtype": "menuseparator" },
                {
                    "xtype": "menuitem",
                    "separator": true,
                    "iconCls": "fa-solid fa-xmark",
                    "text": this.i18nd( "vue-ext", "Clear filter" ),
                    "handler": this._clearRolesFilter.bind( this ),
                },
            ] );

            const grid = e.detail.cmp;

            grid.setPlugins( ["gridviewoptions", "autopaging"] );

            // grid.setColumnMenu( null );

            grid.setItemConfig( { "viewModel": true } );

            grid.setStore( this.store );

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

            cmp.setSummaryRenderer( function ( val ) {
                return "Total Users: " + val;
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
                                        "text": this.i18nd( `vue-ext`, "View user sessions" ),
                                        "handler": this._showUserSessionsDialog.bind( this ),
                                    },
                                    {
                                        "text": this.i18nd( `vue-ext`, "Change password" ),
                                        "handler": this._showChangePasswordDialog.bind( this ),
                                    },
                                    {
                                        "separator": true,
                                        "iconCls": "fa-solid fa-trash-alt",
                                        "text": this.i18nd( `vue-ext`, "Delete user" ),
                                        "handler": this.deleteUser.bind( this ),
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

        reload () {
            this.$refs.cards.mask();

            this.store.loadPage( 1 );
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

            const cmp = await this.$mount( UserRolesDialog );

            cmp.setRecord( record );

            cmp.ext.show();
        },

        async _showChangePasswordDialog ( button ) {
            const record = button.lookupViewModel().get( "record" );

            const cmp = await this.$mount( ChangePasswordDialog, {
                "cache": false,
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
                "cache": false,
                "props": {
                    "userId": record.id,
                    "userEmail": record.get( "email" ),
                },
            } );

            cmp.ext.show();
        },

        // roles filter
        _rolesFilterChange () {
            const rolesFilter = this.$refs.rolesFilter.ext,
                items = rolesFilter.getMenu().getItems(),
                checkedItems = [];

            items.each( item => {
                if ( item.xtype !== "menucheckitem" ) return;

                if ( item.getChecked() ) checkedItems.push( item.getId() );
            } );

            if ( checkedItems.length ) {
                this.$refs.rolesFilter.ext.setText( this.i18nd( "vue-ext", msgid`${checkedItems.length} role`, msgid`${checkedItems.length} roles`, checkedItems.length ) );

                this.store.addFilter( {
                    "property": "roles",
                    "operator": "in",
                    "value": checkedItems,
                } );
            }
            else {
                this.$refs.rolesFilter.ext.setText( this.i18nd( "vue-ext", "Roles" ) );

                this.store.removeFilter( "roles" );
            }
        },

        _clearRolesFilter () {
            const rolesFilter = this.$refs.rolesFilter.ext,
                items = rolesFilter.getMenu().getItems();

            items.each( item => {
                if ( item.xtype !== "menucheckitem" ) return;

                item.setChecked( false );
            } );

            this._rolesFilterChange();
        },
    },
};
</script>

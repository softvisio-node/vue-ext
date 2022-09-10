<template>
    <ext-panel ref="cards" layout="card">
        <ext-toolbar docked="top">
            <ext-searchfield :placeholder="i18nd(`vue-ext`, `Search users`)" width="200" @change="search"/>
            <ext-spacer/>
            <ext-button iconCls="fa-solid fa-user-plus" padding="0 0 0 5" :text="i18nd(`vue-ext`, `Create user`)" @tap="showCreateUserDialog"/>
            <ext-button iconCls="fa-solid fa-redo" :text="i18nd(`vue-ext`, `Refresh`)" @tap="reload"/>
        </ext-toolbar>

        <!-- no-data card -->
        <ext-container ref="noDataCard" :html="i18nd(`vue-ext`, `No records match search criteria`)" layout="center" style="text-align: center"/>

        <!-- error card -->
        <ext-container ref="errorCard" layout='{"align":"center","pack":"center","type":"vbox"}' style="text-align: center">
            <ext-container :html="i18nd(`vue-ext`, `Unable to load records`)"/>
            <ext-button iconCls="fa-solid fa-redo" :text="i18nd(`vue-ext`, `Refresh`)" ui="action" @tap="reload"/>
        </ext-container>

        <!-- data card -->
        <ext-grid ref="dataCard" layout="fit" multicolumnSort="true" plugins='{"gridsummaryrow":true}' @ready="_gridReady">
            <ext-column width="40" @ready="_avatarColReady"/>

            <ext-column dataIndex="name" flex="1" summaryDataIndex="total" :text="i18nd(`vue-ext`, `Username`)" @ready="_nameColReady"/>

            <ext-column cell='{"encodeHtml":false}' dataIndex="last_activity_text" :hidden="lastActivityColumnHidden" sorter='{"property":"last_activity"}' :text="i18nd(`vue-ext`, `Last activity`)" width="150"/>

            <ext-column dataIndex="created" formatter="date()" :hidden="createdColumnHidden" :text="i18nd(`vue-ext`, `Creation date`)" width="150"/>

            <ext-column sorter='{"property":"enabled"}' summaryDataIndex="-" :text="i18nd(`vue-ext`, `Access enabled`)" width="160" @ready="_enabledColReady"/>

            <ext-column width="100" @ready="_actionColReady"/>
        </ext-grid>
    </ext-panel>
</template>

<script>
import "#lib/components/avatar/ext.avatar";
import CreateUserDialog from "./create-user.dialog";
import UserRolesDialog from "./user-roles.dialog";
import UserModel from "./models/user";
import loadMask from "#vue/load-mask";
import ChangePasswordDialog from "./change-password.dialog";

export default {
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

        this.store.on( "load", this._onStoreLoad.bind( this ) );
    },

    "methods": {
        _gridReady ( e ) {
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

        _nameColReady ( e ) {
            var cmp = e.detail.cmp;

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
                                        "text": this.i18nd( `vue-ext`, "Change password" ),
                                        "handler": this._showChangePasswordDialog.bind( this ),
                                    },
                                    {
                                        "xtype": "button",
                                        "text": this.i18nd( `vue-ext`, "View active sessions" ),
                                        "handler": this._showActiveSessionsDialog.bind( this ),
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

        // XXX
        async deleteUserSessions ( button ) {
            const gridrow = button.up( "gridrow" ),
                record = gridrow.getRecord();

            button.disable();

            var res = await this.$api.call( "admin/users/delete-sessions", record.getId() );

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
            this.$refs.cards.ext.mask( loadMask );

            this.store.loadPage( 1 );
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

        _onStoreLoad ( store, records, success ) {
            this.$refs.cards.ext.unmask();

            if ( !success ) {
                this.$refs.cards.ext.setActiveItem( this.$refs.errorCard.ext );
            }
            else if ( !this.store.count() ) {
                this.$refs.cards.ext.setActiveItem( this.$refs.noDataCard.ext );
            }
            else {
                this.$refs.cards.ext.setActiveItem( this.$refs.dataCard.ext );
            }
        },

        async _showChangePasswordDialog ( button ) {
            const record = button.lookupViewModel().get( "record" );

            const cmp = await this.$mount( ChangePasswordDialog, {
                "cache": false,
                "props": {
                    "userId": record.id,
                    "username": record.get( "name" ),
                },
            } );

            cmp.ext.show();
        },

        // XXX
        async _showActiveSessionsDialog () {},
    },
};
</script>

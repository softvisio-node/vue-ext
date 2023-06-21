<template>
    <CardsPanel ref="cards" :store="store" @refresh="refresh">
        <template #docked>
            <ext-toolbar docked="top">
                <ext-searchfield :placeholder="i18nd(`vue-ext`, `Search users`)" width="200" @change="search"/>
                <ext-spacer/>
                <ext-button :disabled="!canCreateUser" iconCls="fa-solid fa-user-plus" padding="0 0 0 5" :text="i18nd(`vue-ext`, `Create user`)" @tap="showCreateUserDialog"/>
                <ext-button iconCls="fa-solid fa-redo" :text="i18nd(`vue-ext`, `Refresh`)" @tap="refresh"/>
            </ext-toolbar>
        </template>

        <template #data>
            <ext-grid itemConfig='{"viewModel":true}' layout="fit" multicolumnSort="true" plugins='["gridviewoptions", "autopaging"]' @ready="_onGridReady">
                <ext-column dataIndex="telegram_username" flex="1" :text="i18nd(`vue-ext`, `Name`)"/>

                <ext-column dataIndex="type" :text="i18nd(`vue-ext`, `Type`)" width="300"/>

                <ext-column dataIndex="static" :text="i18nd(`vue-ext`, `Static`)"/>

                <ext-column dataIndex="total_subscribed_users" :text="i18nd(`vue-ext`, `Users`)"/>

                <ext-column dataIndex="error" :text="i18nd(`vue-ext`, `Error`)"/>

                <ext-column width="80" @ready="_actionColReady"/>
            </ext-grid>
        </template>
    </CardsPanel>
</template>

<script>
import CardsPanel from "#src/components/cards.panel";
import TelegramBotModel from "./models/telegram-bot";

export default {
    "components": { CardsPanel },

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
            "canCreateUser": this.$app.user.hasPermissions( "administration:create" ),
            "canUpdateUser": this.$app.user.hasPermissions( "administration:update" ),
            "canDeleteUser": this.$app.user.hasPermissions( "administration:delete" ),
            "canUpdateUserRoles": this.$app.user.hasPermissions( "administration:update" ) && this.$app.user.hasPermissions( "acl:update" ),
        };
    },

    created () {
        this.store = Ext.create( "Ext.data.Store", {
            "model": TelegramBotModel,
            "autoLoad": false,
            "pageSize": 50,
        } );
    },

    "methods": {

        // public
        async refresh () {
            this.store.loadPage( 1 );
        },

        // protected
        _onGridReady ( e ) {
            const cmp = e.detail.cmp;

            // cmp.setColumnMenu( null );

            cmp.setStore( this.store );
        },

        _actionColReady ( e ) {
            const cmp = e.detail.cmp;

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

            const res = await this.$api.call( "administration/users/set-enabled", record.get( "id" ), enabled );

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

            var res = await this.$api.call( "administration/users/delete", record.getId() );

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

        _copyEmail ( button ) {
            const record = button.lookupViewModel().get( "record" );

            this.$utils.copyToClipboard( record.get( "email" ) );

            this.$utils.toast( this.i18nd( `vue-ext`, `User email copied` ) );
        },
    },
};
</script>

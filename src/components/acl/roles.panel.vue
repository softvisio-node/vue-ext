<template>
    <CardsPanel ref="cards" :store="store" @ready="_onReady" @reload="reload">
        <template #items>
            <ext-toolbar docked="top">
                <ext-searchfield :placeholder="i18nd(`vue-ext`, `Search roles`)" width="200" @change="_searchRoles"/>
                <ext-spacer/>
                <ext-button iconCls="fa-solid fa-redo" :text="i18nd(`vue-ext`, `Refresh`)" @tap="reload"/>
            </ext-toolbar>
        </template>

        <template #data>
            <ext-grid ref="grid" columnMenu="false" columnResize="false" flex="1" itemConfig='{"viewModel":true}' multicolumnSort="true" @ready="_gridReady">
                <ext-column cell='{"encodeHtml":false}' dataIndex="title_html" flex="1" sorter='{"property":"name"}' :text="i18nd(`vue-ext`, `Role`)"/>

                <ext-column align="center" sorter='{"property":"enabled"}' :text="i18nd(`vue-ext`, `Role enabled`)" width="160" @ready="_enabledColReady"/>
            </ext-grid>
        </template>
    </CardsPanel>
</template>

<script>
import CardsPanel from "#src/components/cards.panel";
import RoleModel from "./models/role";

export default {
    "components": { CardsPanel },

    "props": {
        "aclId": {
            "type": String,
            "required": true,
        },
        "userId": {
            "type": String,
            "default": "",
        },
    },

    "emits": ["update"],

    created () {
        this.store = Ext.create( "Ext.data.Store", {
            "model": RoleModel,
            "remoteFilter": false,
            "remoteSort": false,
        } );
    },

    "methods": {

        // public
        async reload () {
            if ( !this.isReady ) return;

            if ( !this.aclId ) return;

            this.$refs.cards.mask();

            this.store.loadRawData( [] );

            const res = await this.$api.call( "acl/get-acl-user-roles", this.aclId, this.userId );

            this.$refs.cards.unmask();

            if ( !res.ok ) {
                this.$refs.cards.setResult( res );

                this.$utils.toast( res );
            }
            else {
                this.store.loadRawData( res.data );
            }
        },

        getEnabledRoles () {
            var roles;

            this.store.each( record => {
                if ( !record.get( "enabled" ) ) return;

                roles ??= [];

                roles.push( record.id );
            } );

            return roles;
        },

        // protected
        _onReady ( e ) {
            this.isReady = true;

            this.reload();
        },

        _gridReady ( e ) {
            const grid = e.detail.cmp;

            grid.setStore( this.store );
        },

        _enabledColReady ( e ) {
            const cmp = e.detail.cmp;

            cmp.setCell( {
                "xtype": "widgetcell",
                "widget": {
                    "xtype": "container",
                    "layout": { "type": "hbox", "pack": "center", "align": "top" },
                    "items": [
                        {
                            "xtype": "togglefield",
                            "bind": {
                                "value": "{record.enabled}",
                                "disabled": "{record.readonly}",
                            },
                            "listeners": { "change": this._setRoleEnabled.bind( this ) },
                        },
                    ],
                },
            } );
        },

        _searchRoles ( e ) {
            const value = e.detail.newValue.trim();

            if ( value !== "" ) {
                this.store.addFilter( {
                    "property": "name",
                    "operator": "like",
                    "value": value,
                } );
            }
            else {
                this.store.removeFilter( "name" );
            }
        },

        async _setRoleEnabled ( button, enabled ) {

            // user is phantom
            if ( !this.userId ) return;

            const record = button.lookupViewModel().get( "record" );

            // not changed
            if ( enabled === record.get( "enabled" ) ) return;

            button.disable();

            var res;

            if ( enabled ) {
                res = await this.$api.call( "acl/add-acl-user-roles", this.aclId, this.userId, [record.id] );
            }
            else {
                res = await this.$api.call( "acl/delete-acl-user-roles", this.aclId, this.userId, [record.id] );
            }

            if ( res.ok ) {
                this.$utils.toast( enabled ? this.i18nd( `vue-ext`, `Role enabled` ) : this.i18nd( `vue-ext`, `Role disabled` ) );

                this.$emit( "update", this.getEnabledRoles() );
            }
            else {
                await this.$utils.sleep( 500 );

                record.set( "enabled", !enabled );

                this.$utils.toast( res );
            }

            button.enable();
        },
    },
};
</script>

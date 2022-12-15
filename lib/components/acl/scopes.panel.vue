<template>
    <CardsPanel ref="cards" :store="store" @ready="_onReady" @reload="reload">
        <template #items>
            <ext-toolbar docked="top">
                <ext-container :html="i18nd(`vue-ext`, `Scopes`)"/>
                <ext-spacer/>
                <ext-button iconCls="fa-solid fa-redo" :text="i18nd(`vue-ext`, `Refresh`)" @tap="reload"/>
            </ext-toolbar>
        </template>

        <template #data>
            <ext-grid ref="grid" columnMenu="false" columnResize="false" flex="1" itemConfig='{"viewModel":true}' multicolumnSort="true" @ready="_gridReady">
                <ext-column cell='{"encodeHtml":false}' dataIndex="title_html" flex="1" sorter='{"property":"name"}' :text="i18nd(`vue-ext`, `Scope`)"/>

                <ext-column align="center" sorter='{"property":"enabled"}' :text="i18nd(`vue-ext`, `Access enabled`)" width="160" @ready="_enabledColReady"/>
            </ext-grid>
        </template>
    </CardsPanel>
</template>

<script>
import CardsPanel from "#lib/components/cards.panel";
import ScopeModel from "./models/scope";

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
            "model": ScopeModel,
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

            const res = await this.$api.call( "acl/get-acl-user-scopes", this.aclId, this.userId );

            this.$refs.cards.unmask();

            if ( !res.ok ) {
                this.$refs.cards.setResult( res );

                this.$utils.toast( res );
            }
            else {
                this.store.loadRawData( res.data );
            }
        },

        getEnabledScopes () {
            var scopes;

            this.store.each( record => {
                if ( !record.get( "enabled" ) ) return;

                scopes ??= [];

                scopes.push( record.id );
            } );

            return scopes;
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
                            "listeners": { "change": this._setScopeEnabled.bind( this ) },
                        },
                    ],
                },
            } );
        },

        async _setScopeEnabled ( button, enabled ) {

            // user is phantom
            if ( !this.userId ) return;

            const record = button.lookupViewModel().get( "record" );

            // not changed
            if ( enabled === record.get( "enabled" ) ) return;

            button.disable();

            var res;

            if ( enabled ) {
                res = await this.$api.call( "acl/add-acl-user-scopes", this.aclId, this.userId, [record.id] );
            }
            else {
                res = await this.$api.call( "acl/delete-acl-user-scopes", this.aclId, this.userId, [record.id] );
            }

            if ( res.ok ) {
                this.$utils.toast( enabled ? this.i18nd( `vue-ext`, `Scope enabled` ) : this.i18nd( `vue-ext`, `Scope disabled` ) );

                this.$emit( "update", this.getEnabledScopes() );
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

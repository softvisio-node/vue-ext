<template>
    <ext-panel ref="cards" layout="card">
        <ext-toolbar docked="top">
            <ext-searchfield :placeholder="i18nd(`vue-ext`, `Search tokens by name`)" width="200" @change="search"/>
            <ext-spacer/>
            <ext-button iconCls="fa-solid fa-plus" :text="i18nd(`vue-ext`, `Create API token`)" @tap="showCreateTokenDialog"/>
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
        <ext-grid ref="dataCard" layout="fit" multicolumnSort="true" plugins='{"gridsummaryrow":true}' @ready="gridReady">
            <ext-column dataIndex="name" flex="1" :text="i18nd(`vue-ext`, `Token name`)"/>

            <ext-column dataIndex="created" formatter='date("dateStyle:short,timeStyle:short")' :text="i18nd(`vue-ext`, `Creation date`)" width="150"/>

            <ext-column sorter='{"property":"enabled"}' summaryDataIndex="-" :text="i18nd(`vue-ext`, `Access enabled`)" width="160" @ready="enabledColReady"/>

            <ext-column width="80" @ready="actionColReady"/>
        </ext-grid>
    </ext-panel>
</template>

<script>
import CreateDialog from "./create/dialog";
import RolesDialog from "./roles/dialog";
import TokenModel from "./models/token";
import loadMask from "#vue/load-mask";

export default {
    created () {
        this.store = Ext.create( "Ext.data.Store", {
            "model": TokenModel,
            "autoLoad": false,
            "pageSize": 100,
        } );

        this.store.on( "load", this._onStoreLoad.bind( this ) );
    },

    "methods": {
        gridReady ( e ) {
            var grid = e.detail.cmp;

            grid.setPlugins( ["autopaging", "gridviewoptions"] );

            // grid.setColumnMenu( null );

            grid.setItemConfig( { "viewModel": true } );

            grid.setStore( this.store );

            this.reload();
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
                            "listeners": { "change": this.setEnabled.bind( this ) },
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
                            "tooltip": this.i18nd( `vue-ext`, "Edit token roles" ),
                            "handler": this.showTokenRolesDialog.bind( this ),
                        },
                        {
                            "xtype": "button",
                            "iconCls": "fa-solid fa-trash-alt",
                            "handler": this.delete.bind( this ),
                        },
                    ],
                },
            } );
        },

        search ( e ) {
            var val = e.detail.newValue.trim();

            if ( val !== "" ) {
                this.store.addFilter(
                    {
                        "property": "name",
                        "operator": "like",
                        "value": val,
                    },
                    false
                );
            }
            else {
                this.store.removeFilter( "name" );
            }
        },

        reload () {
            this.$refs.cards.ext.mask( loadMask );

            this.store.loadPage( 1 );
        },

        async setEnabled ( button, enabled ) {
            const gridrow = button.up( "gridrow" ),
                record = gridrow.getRecord(),
                curVal = record.get( "enabled" );

            if ( enabled === curVal ) return;

            button.disable();

            const res = await this.$api.call( "account/token/set-enabled", record.id, enabled );

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

        async delete ( button ) {
            const gridrow = button.up( "gridrow" ),
                record = gridrow.getRecord();

            if ( !( await this.$utils.confirm( this.i18nd( `vue-ext`, "Are you sure you want to delete this token?" ) ) ) ) return;

            var res = await this.$api.call( "account/token/delete", record.getId() );

            if ( res.ok ) {
                this.$utils.toast( this.i18nd( `vue-ext`, "API token deleted" ) );

                this.store.remove( record );
            }
            else {
                this.$utils.toast( res );
            }
        },

        async showCreateTokenDialog () {
            const cmp = await this.$mount( CreateDialog, {
                "props": {
                    "onCreated": () => this.reload(),
                },
            } );

            cmp.ext.show();
        },

        async showTokenRolesDialog ( button ) {
            const gridrow = button.up( "gridrow" ),
                record = gridrow.getRecord();

            const cmp = await this.$mount( RolesDialog );

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
    },
};
</script>

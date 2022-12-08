<template>
    <CardsPanel ref="cards" :store="store" @reload="reload" @storeLoad="_onStoreLoad">
        <template #items>
            <ext-toolbar docked="top">
                <ext-searchfield :placeholder="i18nd(`vue-ext`, `Search tokens by name`)" width="200" @change="search"/>
                <ext-spacer/>
                <ext-button iconCls="fa-solid fa-plus" :text="i18nd(`vue-ext`, `Create token`)" @tap="showCreateTokenDialog"/>
                <ext-button iconCls="fa-solid fa-redo" :text="i18nd(`vue-ext`, `Refresh`)" @tap="reload"/>
            </ext-toolbar>
        </template>

        <template #data>
            <ext-grid layout="fit" multicolumnSort="true" plugins='{"gridsummaryrow":true}' @ready="gridReady">
                <ext-column dataIndex="name" flex="1" :text="i18nd(`vue-ext`, `Token name`)"/>

                <ext-column cell='{"encodeHtml":false}' dataIndex="last_activity_text" sorter='{"property":"last_activity"}' :text="i18nd(`vue-ext`, `Last activity`)" width="150"/>

                <ext-column dataIndex="created" formatter='date("dateStyle:short,timeStyle:short")' :text="i18nd(`vue-ext`, `Creation date`)" width="150"/>

                <ext-column sorter='{"property":"enabled"}' summaryDataIndex="-" :text="i18nd(`vue-ext`, `Access enabled`)" width="160" @ready="enabledColReady"/>

                <ext-column width="80" @ready="actionColReady"/>
            </ext-grid>
        </template>
    </CardsPanel>
</template>

<script>
import CreateDialog from "./create/dialog";
import TokenModel from "./models/token";
import CardsPanel from "#lib/components/cards.panel";

export default {
    "components": { CardsPanel },

    created () {
        this.store = Ext.create( "Ext.data.Store", {
            "model": TokenModel,
            "autoLoad": false,
            "pageSize": 100,
        } );
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

                        // {
                        //     "xtype": "button",
                        //     "iconCls": "fa-solid fa-unlock-alt",
                        //     "tooltip": this.i18nd( `vue-ext`, "Edit token roles" ),
                        //     "handler": this.showTokenRolesDialog.bind( this ),
                        // },
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
                this.store.addFilter( {
                    "property": "name",
                    "operator": "like",
                    "value": val,
                } );
            }
            else {
                this.store.removeFilter( "name" );
            }
        },

        reload () {
            this.$refs.cards.mask();

            this.store.loadPage( 1 );
        },

        _onStoreLoad () {
            this.$refs.cards.unmask();
        },

        async setEnabled ( button, enabled ) {
            const gridrow = button.up( "gridrow" ),
                record = gridrow.getRecord(),
                curVal = record.get( "enabled" );

            if ( enabled === curVal ) return;

            button.disable();

            const res = await this.$api.call( "account/tokens/set-enabled", record.id, enabled );

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

            var res = await this.$api.call( "account/tokens/delete", record.getId() );

            if ( res.ok ) {
                this.$utils.toast( this.i18nd( `vue-ext`, "Token deleted" ) );

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

        // async showTokenRolesDialog ( button ) {
        //     const gridrow = button.up( "gridrow" ),
        //         record = gridrow.getRecord();

        //     const cmp = await this.$mount( RolesDialog );

        //     cmp.setRecord( record );

        //     cmp.ext.show();
        // },
    },
};
</script>

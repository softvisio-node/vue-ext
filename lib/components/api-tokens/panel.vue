<template>
    <ext-grid ref="grid" layout="fit" plugins='{"gridsummaryrow":"true"}' multicolumnSort="true" @ready="gridReady">
        <ext-toolbar docked="top">
            <ext-searchfield placeholder="search tokens by name" width="200" @change="search"/>
            <ext-spacer/>
            <ext-button iconCls="fas fa-plus" text="Create API Token" @tap="create"/>
            <ext-button iconCls="fas fa-redo" text="Refresh" @tap="refresh"/>
        </ext-toolbar>

        <ext-column text="Name" dataIndex="name" flex="1"/>
        <ext-column text="Created" dataIndex="created" width="150" formatter="date('Y-m-d H:i')"/>
        <ext-column text="Enabled" width="95" sorter='{"property":"enabled"}' summaryDataIndex="-" @ready="enabledColReady"/>
        <ext-column width="40" @ready="actionColReady"/>
    </ext-grid>
</template>

<script>
import CreateDialog from "./create/dialog";

export default {
    data () {
        return {
            "store": this.$store.state["api-tokens"].store,
        };
    },

    "methods": {
        gridReady ( e ) {
            var grid = e.detail.cmp;

            grid.setMultiColumnSort( true );

            grid.setPlugins( [

                //
                { "type": "gridviewoptions" },
                { "type": "listpaging", "noMoreRecordsText": "", "autoPaging": false },
            ] );

            // grid.setColumnMenu( null );

            grid.setItemConfig( { "viewModel": true } );

            grid.setStore( this.store );

            this.store.load();
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
                    "layout": { "type": "hbox", "pack": "end", "align": "end" },
                    "items": [
                        {
                            "xtype": "button",
                            "iconCls": "far fa-trash-alt",
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
                    "property": "search",
                    "operator": "like",
                    "value": val,
                },
                false );
            }
            else {
                this.store.removeFilter( "search" );
            }
        },

        refresh () {
            this.store.loadPage( 1 );
        },

        async setEnabled ( button, newVal, oldVal ) {
            const gridrow = button.up( "gridrow" ),
                record = gridrow.getRecord(),
                curVal = record.get( "enabled" );

            if ( newVal === curVal ) return;

            button.disable();

            var res = await this.$api.call( "api-tokens/set-enabled", record.get( "id" ), newVal );

            if ( !res.ok ) {
                this.$.toast( res );

                await this.$.sleep( 1000 );

                button.suspendEvent( "change" );
                record.set( "enabled", oldVal );
                button.enable();
                button.resumeEvent( "change" );
            }
            else {
                button.enable();
            }

            return;
        },

        async delete ( button ) {
            const gridrow = button.up( "gridrow" ),
                record = gridrow.getRecord();

            if ( !( await this.$.confirm( "Confirmation", "Are you sure you want to do that?" ) ) ) return;

            var res = await this.$api.call( "api-tokens/delete", record.getId() );

            if ( res.ok ) {
                this.$.toast( "API token deleted" );

                this.store.remove( record );
            }
            else {
                this.$.toast( res );
            }
        },

        async create () {
            if ( !this.createDialog ) this.createDialog = await Ext.Viewport.addVue( CreateDialog );

            this.createDialog.$ext.show();
        },
    },
};
</script>

<template>
    <ext-grid ref="grid" layout="fit" plugins='{"gridsummaryrow":"true"}' multicolumnSort="true" @ready="gridReady">
        <ext-toolbar docked="top">
            <ext-searchfield placeholder="search tokens by name" width="200" @change="search"/>
            <ext-spacer/>
            <ext-button iconCls="fas fa-redo" text="Refresh" @tap="refresh"/>
        </ext-toolbar>

        <ext-column text="Method ID" dataIndex="id" width="300"/>
        <ext-column text="Requests Rate" width="150" flex="1" @ready="requestsRateColReady"/>
        <ext-column text="Average Request Runtime" width="150" flex="1" @ready="avgRuntimeColReady"/>
        <!-- <ext&#45;column width="40" @ready="actionColReady"/> -->
    </ext-grid>
</template>

<script>
import ApiCallLogTotalsModel from "#softvisio/models/api-call-log-totals";

export default {
    mounted () {
        this.store = new Ext.data.Store( {
            "model": ApiCallLogTotalsModel,
            "autoLoad": false,
            "pageSize": null,
            "remoteSort": false,
            "remoteFilter": false,
        } );
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

            this.refresh();
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

        requestsRateColReady ( e ) {
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

        // XXX
        avgRuntimeColReady ( e ) {
            this.requestsRateColReady( e );
        },

        // XXX
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
                    "property": "id",
                    "operator": "like",
                    "value": val,
                },
                false );
            }
            else {
                this.store.removeFilter( "search" );
            }
        },

        async refresh () {
            const res = await this.$api.call( "admin/api-call-log/read-totals" );

            this.store.setData( res.data );
        },

        // XXX
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

        // XXX
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
    },
};
</script>

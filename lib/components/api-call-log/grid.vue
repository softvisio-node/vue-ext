<template>
    <ext-grid ref="grid" layout="fit" plugins='{"gridsummaryrow":"true"}' multicolumnSort="true" @ready="gridReady">
        <ext-toolbar docked="top">
            <ext-searchfield placeholder="search tokens by name" width="200" @change="search"/>
            <ext-spacer/>
            <ext-button iconCls="fas fa-redo" text="Refresh" @tap="refresh"/>
        </ext-toolbar>

        <ext-column text="Method ID" dataIndex="id" width="300"/>
        <ext-column text="Total Limit" dataIndex="max_running_requests" width="100"/>
        <ext-column text="User Limit" dataIndex="max_running_requests_user" width="100"/>
        <ext-column text="Requests Rate" width="150" flex="1" @ready="requestsRateColReady"/>
        <ext-column text="Average Request Runtime" width="150" flex="1" @ready="avgRuntimeColReady"/>
        <!-- <ext&#45;column width="40" @ready="actionColReady"/> -->
    </ext-grid>
</template>

<script>
import AmchartsPanel from "#softvisio/components/am4charts/panel";
import ApiCallLogTotalsModel from "#softvisio/models/api-call-log-totals";

export default {
    "components": { AmchartsPanel },

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
                    "height": 130,
                    "bind": { "stat": "{record.stat}" },
                    "listeners": { "initialize": this.requestRateChartReady.bind( this ) },
                    setStat ( stat ) {
                        this.chart.setData( stat );
                    },
                },
            } );
        },

        avgRuntimeColReady ( e ) {
            var cmp = e.detail.cmp;

            cmp.setCell( {
                "xtype": "widgetcell",
                "widget": {
                    "xtype": "container",
                    "height": 130,
                    "bind": { "stat": "{record.stat}" },
                    "listeners": { "initialize": this.avgRuntimeChartReady.bind( this ) },
                    setStat ( stat ) {
                        this.chart.setData( stat );
                    },
                },
            } );
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

        // XXX
        async requestRateChartReady ( cmp ) {
            var chart = await cmp.addVue( AmchartsPanel );

            cmp.chart = chart;

            chart.create( {
                "type": "XYChart",

                "dateFormatter": {
                    "inputDateFormat": "yyyy-MM-dd HH:mm:ss",
                },

                // "responsive": { "enabled": true },
                "cursor": { "type": "XYCursor", "behavior": "zoomX" },

                "xAxes": [
                    {
                        "type": "DateAxis",
                        "renderer": {
                            "inside": true, // render labels inside chart
                        },
                    },
                ],
                "yAxes": [
                    {
                        "id": "requests",
                        "type": "ValueAxis",
                        "title": { "text": "Requests" },
                        "min": 0,
                    },
                ],

                "series": [
                    {
                        "id": "accepted_requests",
                        "type": "ColumnSeries",
                        "name": "Accepted",
                        "yAxis": "requests",
                        "dataFields": {
                            "dateX": "date",
                            "valueY": "total_accepted_requests",
                        },
                        "tooltipText": "Accepted: {valueY.value} requests",
                        "stacked": true,
                        "fill": "green",
                        "stroke": "green",
                        "columns": {
                            "maxWidth": 30,
                        },
                    },
                    {
                        "id": "declined_requests",
                        "type": "ColumnSeries",
                        "name": "Declined",
                        "yAxis": "requests",
                        "dataFields": {
                            "dateX": "date",
                            "valueY": "total_declined_requests",
                        },
                        "tooltipText": "Declined: {valueY.value} requests",
                        "stacked": true,
                        "fill": "red",
                        "stroke": "red",
                        "columns": {
                            "maxWidth": 30,
                        },
                    },
                ],
            } );
        },

        async avgRuntimeChartReady ( cmp ) {
            var chart = await cmp.addVue( AmchartsPanel );

            cmp.chart = chart;

            cmp.chart = chart;

            chart.create( {
                "type": "XYChart",

                "dateFormatter": {
                    "inputDateFormat": "yyyy-MM-dd HH:mm:ss",
                },

                // "responsive": { "enabled": true },
                "cursor": { "type": "XYCursor", "behavior": "zoomX" },

                "xAxes": [
                    {
                        "type": "DateAxis",
                        "renderer": { "inside": true }, // render labels inside chart
                    },
                ],
                "yAxes": [
                    {
                        "id": "seconds",
                        "type": "ValueAxis",
                        "title": { "text": "Seconds" },
                        "min": 0,
                    },
                ],

                "series": [
                    {
                        "id": "avg_runtime",
                        "type": "ColumnSeries",
                        "name": "Avg. runtime",
                        "yAxis": "seconds",
                        "dataFields": {
                            "dateX": "date",
                            "valueY": "avg_runtime",
                        },
                        "tooltipText": "Avg. runtime: {valueY.value} sec.",
                        "stacked": true,
                        "fill": "green",
                        "stroke": "green",
                        "columns": {
                            "maxWidth": 30,
                        },
                    },
                ],
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

<template>
    <ext-grid ref="grid" layout="fit" plugins='{"gridsummaryrow":"true"}' multicolumnSort="true" @ready="gridReady">
        <ext-toolbar docked="top">
            <ext-searchfield placeholder="search tokens by name" width="200" @change="search"/>
            <ext-spacer/>
            <ext-togglefield label="AUTO REFRESH" labelAlign="right" @change="autoRefreshChange"/>
            <ext-button ref="refreshButton" iconCls="fas fa-redo" text="Refresh" @tap="refresh"/>
        </ext-toolbar>

        <ext-column text="API Method ID" width="300" sorter='{"property":"id"}' @ready="idColReady"/>
        <ext-column text="Load for Last 45 Minutes" flex="1" align="center" @ready="loadColReady"/>
        <ext-column text="Average Request Runtime for Last 45 Minutes" flex="1" align="center" @ready="avgRuntimeColReady"/>
        <ext-column text="Exceptions for Last 45 Minutes (%)" flex="1" align="center" @ready="exceptionsColReady"/>
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

        idColReady ( e ) {
            var cmp = e.detail.cmp;

            cmp.setCell( {
                "xtype": "widgetcell",
                "layout": "fit",
                "widget": {
                    "xtype": "container",
                    "layout": { "type": "vbox", "pack": "start", "align": "start" },
                    "padding": "0 10 0 10",
                    "items": [
                        {
                            "xtype": "displayfield",
                            "encodeHtml": false,
                            "bind": "{record.id_text}",
                        },
                        {
                            "xtype": "fieldcontainer",
                            "width": "100%",
                            "labelCls": "no-padding",
                            "label": "Active Requests",

                            // "labelAlign": "left",
                            // "labelWidth": 180,
                            "items": [
                                {
                                    "xtype": "progress",
                                    "width": "100%",
                                    "bind": {
                                        "text": "{record.active_requests_text}",
                                        "value": "{record.active_requests_value}",
                                    },
                                },
                            ],
                        },
                        {
                            "xtype": "displayfield",
                            "label": "Active Requests Limit",
                            "labelAlign": "left",
                            "labelWidth": 180,
                            "height": 18,
                            "labelCls": "no-padding",
                            "encodeHtml": false,
                            "bind": "{record.active_requests_limit_text}",
                        },
                        {
                            "xtype": "displayfield",
                            "label": "Active Requests Limit per User",
                            "labelAlign": "left",
                            "labelWidth": 180,
                            "height": 18,
                            "labelCls": "no-padding",
                            "encodeHtml": false,
                            "bind": "{record.active_requests_user_limit_text}",
                        },
                    ],
                },
            } );
        },

        loadColReady ( e ) {
            var cmp = e.detail.cmp;

            cmp.setCell( {
                "xtype": "widgetcell",
                "widget": {
                    "xtype": "container",
                    "height": 150,
                    "bind": { "chartData": "{record.load}" },
                    "listeners": { "initialize": this.loadChartReady.bind( this ) },
                    setChartData ( data ) {
                        this.chart.setData( data );
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
                    "height": 150,
                    "bind": { "chartData": "{record.requests}" },
                    "listeners": { "initialize": this.avgRuntimeChartReady.bind( this ) },
                    setChartData ( data ) {
                        this.chart.setData( data );
                    },
                },
            } );
        },

        exceptionsColReady ( e ) {
            var cmp = e.detail.cmp;

            cmp.setCell( {
                "xtype": "widgetcell",
                "widget": {
                    "xtype": "container",
                    "height": 150,
                    "bind": { "chartData": "{record.requests}" },
                    "listeners": { "initialize": this.exceptionsChartReady.bind( this ) },
                    setChartData ( data ) {
                        this.chart.setData( data );
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

        async loadChartReady ( cmp ) {
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
                        "renderer": { "inside": true }, // render labels inside chart
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
                            "valueY": "total_accepted",
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
                            "valueY": "total_declined",
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

        async exceptionsChartReady ( cmp ) {
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
                        "id": "exceptions",
                        "type": "ValueAxis",
                        "title": { "text": "Exceptions (%)" },
                        "min": 0,
                        "max": 100,
                        "strictMinMax": true,
                    },
                ],

                "series": [
                    {
                        "id": "exceptions_percent",
                        "type": "ColumnSeries",
                        "name": "Exceptions",
                        "yAxis": "exceptions",
                        "dataFields": {
                            "dateX": "date",
                            "valueY": "exceptions_percent",
                        },
                        "tooltipText": "Exceptions: {valueY.value}%",
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

        autoRefreshChange ( e ) {
            const val = e.detail.newValue;

            if ( this.autoRefreshInterval ) {
                clearInterval( this.autoRefreshInterval );
                this.autoRefreshInterval = null;
            }

            if ( val ) this.autoRefreshInterval = setInterval( () => this.refresh(), 60000 );
        },

        async refresh () {
            if ( this.refreshing ) return;

            this.refreshing = true;
            this.$refs.refreshButton.ext.setDisabled( true );

            const res = await this.$api.call( "admin/api-call-log/read-totals" );

            this.refreshing = false;
            this.$refs.refreshButton.ext.setDisabled( false );

            if ( !res.ok ) return;

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

<style>
    .no-padding {
        padding-top: 0px !important;
        padding-bottom: 0px !important;
    }
</style>

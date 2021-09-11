<template>
    <ext-grid ref="grid" layout="fit" plugins='{"gridsummaryrow":true}' multicolumnSort="true" @ready="gridReady">
        <ext-toolbar docked="top">
            <ext-searchfield placeholder="search tokens by name" width="200" @change="search"/>
            <ext-spacer/>
            <ext-togglefield label="AUTO REFRESH" labelAlign="right" @change="autoRefreshChange"/>
            <ext-button ref="refreshButton" iconCls="fas fa-redo" text="Refresh" @tap="refresh"/>
        </ext-toolbar>

        <ext-column text="API Method ID" width="300" sorter='{"property":"id"}' @ready="idColReady"/>
        <ext-column text="Load for Last 60 Minutes" flex="1" align="center" @ready="loadColReady"/>
        <ext-column text="Average Request Runtime for Last 60 Minutes" flex="1" align="center" @ready="avgRuntimeColReady"/>
        <ext-column text="Exceptions for Last 60 Minutes (%)" flex="1" align="center" @ready="exceptionsColReady"/>
        <ext-column width="40" @ready="actionColReady"/>
    </ext-grid>
</template>

<script>
import AmchartsPanel from "#softvisio/components/am4charts/panel";
import ApiCallLogStatModel from "#softvisio/models/api-call-log/stat";
import HistoryDialog from "./history/dialog";
import LogDialog from "./log/dialog";

export default {
    mounted () {
        this.store = new Ext.data.Store( {
            "model": ApiCallLogStatModel,
            "autoLoad": false,
            "pageSize": null,
            "remoteSort": false,
            "remoteFilter": false,
        } );
    },

    "methods": {
        gridReady ( e ) {
            var grid = e.detail.cmp;

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
                                    "animate": true,
                                    "bind": {
                                        "text": "{record.active_requests_text}",
                                        "value": "{record.active_requests_value}",
                                    },
                                    "listeners": {
                                        change ( progress, newValue, oldValue ) {
                                            if ( newValue === 1 ) progress.setColor( "red" );
                                            else if ( newValue >= 0.7 ) progress.setColor( "salmon" );
                                            else progress.setColor();
                                        },
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

        actionColReady ( e ) {
            var cmp = e.detail.cmp;

            cmp.setCell( {
                "xtype": "widgetcell",
                "widget": {
                    "xtype": "container",
                    "layout": { "type": "vbox", "pack": "start", "align": "center" },
                    "items": [
                        {
                            "xtype": "button",
                            "iconCls": "fas fa-chart-line",
                            "handler": this.showHistory.bind( this ),
                        },
                        {
                            "xtype": "button",
                            "iconCls": "fas fa-list",
                            "handler": this.showLog.bind( this ),
                        },
                        { "xtype": "container", "height": 80 },
                    ],
                },
            } );
        },

        async loadChartReady ( cmp ) {
            var chart = await this.$mount( AmchartsPanel, { "el": cmp, "noCache": true } );

            cmp.chart = chart;

            chart.create( {
                "type": "XYChart",

                "dateFormatter": { "inputDateFormat": "yyyy-MM-dd HH:mm:ss" },

                // "responsive": { "enabled": true },
                "cursor": { "type": "XYCursor", "behavior": "none" },

                "xAxes": [
                    {
                        "type": "DateAxis",

                        // "renderer": { "inside": true }, // render labels inside chart
                    },
                ],
                "yAxes": [
                    {
                        "id": "value",
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
                        "yAxis": "value",
                        "dataFields": {
                            "dateX": "date",
                            "valueY": "total_accepted",
                        },
                        "tooltipText": "Accepted requests: {valueY.value}",
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
                        "yAxis": "value",
                        "dataFields": {
                            "dateX": "date",
                            "valueY": "total_declined",
                        },
                        "tooltipText": "Declined requests: {valueY.value}",
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
            var chart = await this.$mount( AmchartsPanel, { "el": cmp, "noCache": true } );

            cmp.chart = chart;

            cmp.chart = chart;

            chart.create( {
                "type": "XYChart",

                "dateFormatter": { "inputDateFormat": "yyyy-MM-dd HH:mm:ss" },

                // "responsive": { "enabled": true },
                "cursor": { "type": "XYCursor", "behavior": "none" },

                "xAxes": [
                    {
                        "type": "DateAxis",

                        // "renderer": { "inside": true }, // render labels inside chart
                    },
                ],
                "yAxes": [
                    {
                        "id": "value",
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
                        "yAxis": "value",
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
            var chart = await this.$mount( AmchartsPanel, { "el": cmp, "noCache": true } );

            cmp.chart = chart;

            cmp.chart = chart;

            chart.create( {
                "type": "XYChart",

                "dateFormatter": { "inputDateFormat": "yyyy-MM-dd HH:mm:ss" },

                // "responsive": { "enabled": true },
                "cursor": { "type": "XYCursor", "behavior": "none" },

                "xAxes": [
                    {
                        "type": "DateAxis",

                        // "renderer": { "inside": true }, // render labels inside chart
                    },
                ],
                "yAxes": [
                    {
                        "id": "value",
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
                        "yAxis": "value",
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

            if ( val ) {
                this._setAutoRefreshInterval( 60000 );
            }
            else {
                this._setAutoRefreshInterval( 0 );
            }
        },

        _setAutoRefreshInterval ( interval ) {
            this.autoRefreshInterval = interval;

            this._resumeAutoRefresh();
        },

        _pauseAutoRefresh () {
            if ( this.autoRefreshIntervalClean ) {
                clearInterval( this.autoRefreshIntervalClean );

                this.autoRefreshIntervalClean = null;
            }
        },

        _resumeAutoRefresh () {
            this._pauseAutoRefresh();

            if ( !this.autoRefreshInterval ) return;

            this.autoRefreshIntervalClean = setInterval( () => this.refresh(), this.autoRefreshInterval );
        },

        async refresh () {
            if ( this.refreshing ) return;

            this.refreshing = true;
            this.$refs.refreshButton.ext.setDisabled( true );
            this._pauseAutoRefresh();

            const res = await this.$api.call( "admin/api-call-log/read-latest-stat" );

            this.refreshing = false;
            this.$refs.refreshButton.ext.setDisabled( false );
            this._resumeAutoRefresh();

            if ( !res.ok ) return;

            this.store.setData( res.data );
        },

        async showHistory ( button ) {
            const gridrow = button.up( "gridrow" ),
                record = gridrow.getRecord();

            const cmp = await this.$mount( HistoryDialog );

            cmp.setRecord( record );

            cmp.ext.show();
        },

        async showLog ( button ) {
            const gridrow = button.up( "gridrow" ),
                record = gridrow.getRecord();

            const cmp = await this.$mount( LogDialog );

            cmp.setRecord( record );

            cmp.ext.show();
        },
    },
};
</script>

<style>
.no-padding {
    padding-top: 0px !important;
    padding-bottom: 0px !important;
}
.progress-full {
    backgroundcolor: red;
}
</style>

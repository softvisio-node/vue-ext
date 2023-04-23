<template>
    <ext-grid ref="grid" layout="fit" multicolumnSort="true" plugins='{"gridsummaryrow":true}' @ready="_ready">
        <ext-toolbar docked="top">
            <ext-searchfield :placeholder="i18nd(`vue-ext`, `Search for methods by name`)" width="200" @change="search"/>
            <ext-spacer/>
            <ext-togglefield :label="i18nd(`vue-ext`, `Auto refresh`)" labelAlign="right" @change="autoRefreshChange"/>
            <ext-button ref="refreshButton" iconCls="fa-solid fa-redo" :text="i18nd(`vue-ext`, `Refresh`)" @tap="reload"/>
        </ext-toolbar>

        <ext-column sorter='{"property":"id"}' :text="i18nd(`vue-ext`, `API method id`)" width="300" @ready="idColReady"/>
        <ext-column align="center" flex="1" :text="i18nd(`vue-ext`, `Load for last 60 minutes`)" @ready="_loadColReady"/>
        <ext-column align="center" flex="1" :text="i18nd(`vue-ext`, `Average request runtime for last 60 minutes`)" @ready="_avgRuntimeColReady"/>
        <ext-column align="center" flex="1" :text="i18nd(`vue-ext`, `Exceptions for last 60 minutes (%)`)" @ready="_exceptionsColReady"/>
        <ext-column width="40" @ready="_actionColReady"/>
    </ext-grid>
</template>

<script>
import StatModel from "./models/stat";
import HistoryDialog from "./history/dialog";
import LogDialog from "./log/dialog";
import "#vue/components/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";

export default {
    created () {
        this.store = new Ext.data.Store( {
            "model": StatModel,
            "autoLoad": false,
            "pageSize": null,
            "remoteSort": false,
            "remoteFilter": false,
        } );
    },

    "methods": {
        _ready ( e ) {
            const cmp = e.detail.cmp;

            // cmp.setColumnMenu( null );

            cmp.setItemConfig( { "viewModel": true } );

            cmp.setStore( this.store );

            if ( cmp.rendered ) {
                this.reload();
            }
            else {
                cmp.afterRender = () => this.reload();
            }
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

        _loadColReady ( e ) {
            const cmp = e.detail.cmp;

            cmp.setCell( {
                "xtype": "widgetcell",
                "widget": {
                    "xtype": "amcharts5",
                    "height": 150,
                    "createChart": this._createLoadChart.bind( this ),
                    "updateChart": this._updateChart.bind( this ),
                    "bind": { "data": "{record.series}" },
                },
            } );
        },

        _avgRuntimeColReady ( e ) {
            const cmp = e.detail.cmp;

            cmp.setCell( {
                "xtype": "widgetcell",
                "widget": {
                    "xtype": "amcharts5",
                    "height": 150,
                    "createChart": this._createAvgRuntimeChart.bind( this ),
                    "updateChart": this._updateChart.bind( this ),
                    "bind": { "data": "{record.series}" },
                },
            } );
        },

        _exceptionsColReady ( e ) {
            const cmp = e.detail.cmp;

            cmp.setCell( {
                "xtype": "widgetcell",
                "widget": {
                    "xtype": "amcharts5",
                    "height": 150,
                    "createChart": this._createExceptionsChart.bind( this ),
                    "updateChart": this._updateChart.bind( this ),
                    "bind": { "data": "{record.series}" },
                },
            } );
        },

        _actionColReady ( e ) {
            var cmp = e.detail.cmp;

            cmp.setCell( {
                "xtype": "widgetcell",
                "widget": {
                    "xtype": "container",
                    "layout": { "type": "vbox", "pack": "start", "align": "center" },
                    "items": [
                        {
                            "xtype": "button",
                            "iconCls": "fa-solid fa-chart-line",
                            "handler": this.showHistory.bind( this ),
                        },
                        {
                            "xtype": "button",
                            "iconCls": "fa-solid fa-list",
                            "handler": this.showLog.bind( this ),
                        },
                        { "xtype": "container", "height": 80 },
                    ],
                },
            } );
        },

        _createLoadChart ( cmp ) {
            const root = cmp.root,
                am5 = cmp.am5;

            const chart = root.container.children.push( am5xy.XYChart.new( root, {

                // "panX": true,
                // "panY": true,
                // "wheelX": "panX",
                // "wheelY": "zoomX",
                // "pinchZoomX": true,
            } ) );

            chart.set(
                "cursor",
                am5xy.XYCursor.new( root, {
                    "behavior": "none", // "zoomX",
                } )
            );

            const xAxis = chart.xAxes.push( am5xy.DateAxis.new( root, {
                "baseInterval": {
                    "timeUnit": "minute",
                    "count": 1,
                },
                "renderer": am5xy.AxisRendererX.new( root, {} ),
                "tooltipDateFormat": "HH:mm",
                "tooltip": am5.Tooltip.new( root, {} ),
            } ) );

            const yAxis = chart.yAxes.push( am5xy.ValueAxis.new( root, {
                "renderer": am5xy.AxisRendererY.new( root, {} ),
            } ) );

            const series1 = chart.series.push( am5xy.ColumnSeries.new( root, {
                "name": "Accepted",
                "xAxis": xAxis,
                "yAxis": yAxis,
                "valueXField": "date",
                "valueYField": "total_accepted",
                "fill": "green",
                "stroke": "green",
                "stacked": true,
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": "Accepted requests: {valueY}",
                } ),
            } ) );

            chart.series.push( am5xy.ColumnSeries.new( root, {
                "name": "Declined",
                "xAxis": xAxis,
                "yAxis": yAxis,
                "valueXField": "date",
                "valueYField": "total_declined",
                "fill": "red",
                "stroke": "red",
                "stacked": true,
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": "Declined requests: {valueY}",
                } ),
            } ) );

            series1.data.processor = am5.DataProcessor.new( root, {
                "dateFields": ["date"],
                "dateFormat": "i",
            } );
        },

        _createAvgRuntimeChart ( cmp ) {
            const root = cmp.root,
                am5 = cmp.am5;

            const chart = root.container.children.push( am5xy.XYChart.new( root, {

                // "panX": true,
                // "panY": true,
                // "wheelX": "panX",
                // "wheelY": "zoomX",
                // "pinchZoomX": true,
            } ) );

            chart.set(
                "cursor",
                am5xy.XYCursor.new( root, {
                    "behavior": "none", // "zoomX",
                } )
            );

            const xAxis = chart.xAxes.push( am5xy.DateAxis.new( root, {
                "baseInterval": {
                    "timeUnit": "minute",
                    "count": 1,
                },
                "renderer": am5xy.AxisRendererX.new( root, {} ),
                "tooltipDateFormat": "HH:mm",
                "tooltip": am5.Tooltip.new( root, {} ),
            } ) );

            const yAxis = chart.yAxes.push( am5xy.ValueAxis.new( root, {
                "renderer": am5xy.AxisRendererY.new( root, {} ),
            } ) );

            const series1 = chart.series.push( am5xy.ColumnSeries.new( root, {
                "name": "Avg. runtime",
                "xAxis": xAxis,
                "yAxis": yAxis,
                "valueXField": "date",
                "valueYField": "avg_runtime",
                "fill": "green",
                "stroke": "green",
                "stacked": true,
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": "Avg. runtime: {valueY} sec.",
                } ),
            } ) );

            series1.data.processor = am5.DataProcessor.new( root, {
                "dateFields": ["date"],
                "dateFormat": "i",
            } );
        },

        _createExceptionsChart ( cmp ) {
            const root = cmp.root,
                am5 = cmp.am5;

            const chart = root.container.children.push( am5xy.XYChart.new( root, {

                // "panX": true,
                // "panY": true,
                // "wheelX": "panX",
                // "wheelY": "zoomX",
                // "pinchZoomX": true,
            } ) );

            chart.set(
                "cursor",
                am5xy.XYCursor.new( root, {
                    "behavior": "none", // "zoomX",
                } )
            );

            const xAxis = chart.xAxes.push( am5xy.DateAxis.new( root, {
                "baseInterval": {
                    "timeUnit": "minute",
                    "count": 1,
                },
                "renderer": am5xy.AxisRendererX.new( root, {} ),
                "tooltipDateFormat": "HH:mm",
                "tooltip": am5.Tooltip.new( root, {} ),
            } ) );

            const yAxis = chart.yAxes.push( am5xy.ValueAxis.new( root, {
                "renderer": am5xy.AxisRendererY.new( root, {} ),
            } ) );

            const series1 = chart.series.push( am5xy.ColumnSeries.new( root, {
                "name": "Exceptions (%)",
                "xAxis": xAxis,
                "yAxis": yAxis,
                "valueYField": "errors_percent",
                "valueXField": "date",
                "fill": "red",
                "stroke": "red",
                "stacked": true,
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": "Exceptions: {valueY}%",
                } ),
            } ) );

            series1.data.processor = am5.DataProcessor.new( root, {
                "dateFields": ["date"],
                "dateFormat": "i",
            } );
        },

        _updateChart ( cmp, data ) {
            const chart = cmp.root.container.children.values[0];

            chart.xAxes.values[0].data.setAll( data || [] );

            for ( const serie of chart.series ) {
                serie.data.setAll( data || [] );
            }
        },

        search ( e ) {
            var val = e.detail.newValue.trim();

            if ( val !== "" ) {
                this.store.addFilter( {
                    "property": "id",
                    "operator": "like",
                    "value": val,
                } );
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

            this.autoRefreshIntervalClean = setInterval( () => this.reload(), this.autoRefreshInterval );
        },

        async reload () {
            if ( this.refreshing ) return;

            this.refreshing = true;
            this.$refs.refreshButton.ext.setDisabled( true );
            this._pauseAutoRefresh();

            const res = await this.$api.call( "admin/api-call-log/get-latest-stats" );

            this.refreshing = false;
            this.$refs.refreshButton.ext.setDisabled( false );
            this._resumeAutoRefresh();

            if ( !res.ok ) return;

            this.store.setData( res.data );
        },

        async showHistory ( button ) {
            const record = button.up( "gridrow" ).getRecord();

            const cmp = await this.$mount( HistoryDialog, {
                "props": {
                    "methodId": record.id,
                },
            } );

            cmp.ext.show();
        },

        async showLog ( button ) {
            const record = button.up( "gridrow" ).getRecord();

            const cmp = await this.$mount( LogDialog, {
                "props": {
                    "methodId": record.id,
                },
            } );

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

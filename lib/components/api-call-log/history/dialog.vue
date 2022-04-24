<template>
    <ext-dialog :title="title" width="95%" height="95%" scrollable="true" closeAction="hide" layout="vbox" viewModel="true">
        <ext-toolbar docked="top">
            <ext-spacer/>
            <ext-button iconCls="fa-solid fa-redo" text="Refresh" @tap="refresh"/>
        </ext-toolbar>

        <Amcharts5Panel height="250" @ready="_createLoadChart" @data="_updateChart"/>

        <AmchartsPanel height="300" @ready="_runtimeChartReady"/>
        <AmchartsPanel height="300" @ready="_exceptionsChartReady"/>
    </ext-dialog>
</template>

<script>
import AmchartsPanel from "#vue/components/amcharts4/panel";
import Amcharts5Panel from "#vue/components/amcharts5/panel";
import * as am5xy from "@amcharts/amcharts5/xy";

export default {
    "components": { AmchartsPanel, Amcharts5Panel },

    data () {
        return { "title": "History" };
    },

    "methods": {
        setRecord ( record ) {
            this.record = record;

            this.title = `History for Method "${record.id}"`;

            this.refresh();
        },

        _createLoadChart ( cmp ) {
            this._loadChart = cmp;

            const root = cmp.root,
                am5 = cmp.am5;

            const chart = root.container.children.push( am5xy.XYChart.new( root, {
                "layout": root.verticalLayout,
                "panX": true,
                "panY": true,
                "pinchZoomX": true,

                // "wheelX": "panX",
                // "wheelY": "zoomX",
            } ) );

            chart.set( "cursor",
                am5xy.XYCursor.new( root, {
                    "behavior": "zoomX",
                } ) );

            // add scrollbar, https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
            chart.set( "scrollbarX",
                am5.Scrollbar.new( root, {
                    "orientation": "horizontal",
                } ) );

            chart.children.unshift( am5.Label.new( root, {
                "text": "Acceptes / Declined Requests for Last 30 Days",
                "fontSize": 12,
                "x": am5.percent( 50 ),
                "centerX": am5.percent( 50 ),
            } ) );

            const xAxis = chart.xAxes.push( am5xy.DateAxis.new( root, {
                "maxDeviation": 0,
                "baseInterval": {
                    "timeUnit": "hour",
                    "count": 1,
                },
                "renderer": am5xy.AxisRendererX.new( root, {} ),
                "tooltipDateFormat": "I",
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
                "stroke": "green",
                "fill": "green",
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

            const legend = chart.children.push( am5.Legend.new( root, {
                "x": am5.percent( 50 ),
                "centerX": am5.percent( 50 ),
            } ) );
            legend.data.setAll( chart.series.values );

            this.refresh();
        },

        // XXX
        _runtimeChartReady ( chart ) {
            this.runtimeChart = chart;

            chart.create( {
                "titles": [{ "text": "Average Runtime for Last 30 Days", "fontSize": 12 }],
                "type": "XYChart",

                "dateFormatter": { "inputDateFormat": "yyyy-MM-dd HH:mm:ss" },

                "cursor": { "type": "XYCursor", "behavior": "zoomX" },

                "scrollbarX": {
                    "type": "XYChartScrollbar",
                    "series": ["runtime"],
                },

                "xAxes": [
                    {
                        "type": "DateAxis",

                        // grouping
                        "groupData": true,
                        "groupCount": 24 * 30,

                        // pre-zoom
                        "start": 0.75,
                        "end": 1,
                        "keepSelection": true,
                    },
                ],
                "yAxes": [
                    {
                        "id": "value",
                        "type": "ValueAxis",
                        "title": { "text": "Seconds" },
                        "min": 0,
                        "numberFormatter": { "type": "NumberFormatter", "numberFormat": "#.##" },
                    },
                ],

                "series": [
                    {
                        "id": "runtime",
                        "type": "ColumnSeries",
                        "name": "Runtime",
                        "yAxis": "value",
                        "dataFields": {
                            "dateX": "date",
                            "valueY": "avg_runtime",
                        },
                        "groupFields": { "valueY": "average" },
                        "tooltipText": "Average runtime: {valueY.value} sec.",
                        "stacked": true,
                        "fill": "green",
                        "stroke": "green",
                        "columns": {
                            "maxWidth": 30,
                        },
                    },
                ],
            } );

            this.refresh();
        },

        // XXX
        _exceptionsChartReady ( chart ) {
            this.exceptionsChart = chart;

            chart.create( {
                "titles": [{ "text": "Exceptions Percent for Last 30 Days", "fontSize": 12 }],
                "type": "XYChart",

                "dateFormatter": { "inputDateFormat": "yyyy-MM-dd HH:mm:ss" },

                "cursor": { "type": "XYCursor", "behavior": "zoomX" },

                "scrollbarX": {
                    "type": "XYChartScrollbar",
                    "series": ["exceptions"],
                },

                "xAxes": [
                    {
                        "type": "DateAxis",

                        // grouping
                        "groupData": true,
                        "groupCount": 24 * 30,

                        // pre-zoom
                        "start": 0.75,
                        "end": 1,
                        "keepSelection": true,
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
                        "numberFormatter": { "type": "NumberFormatter", "numberFormat": "#.##" },
                    },
                ],

                "series": [
                    {
                        "id": "exceptions",
                        "type": "ColumnSeries",
                        "name": "Exceptions",
                        "yAxis": "value",
                        "dataFields": {
                            "dateX": "date",
                            "valueY": "errors_percent",
                        },
                        "groupFields": { "valueY": "average" },
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

            this.refresh();
        },

        _updateChart ( cmp, data ) {
            const chart = cmp.root.container.children.values[0];

            chart.xAxes.values[0].data.setAll( data || [] );

            for ( const serie of chart.series ) {
                serie.data.setAll( data || [] );
            }
        },

        async refresh () {
            if ( !this.record || !this._loadChart || !this.runtimeChart || !this.exceptionsChart ) return;

            this.ext.mask();

            const res = await this.$api.call( "admin/api-call-log/get-history-stats", this.record.id );

            this.ext.unmask();

            if ( !res.ok ) {
                this.$utils.toast( res );

                this.ext.hide();
            }

            this._loadChart.setData( res.data );

            this.runtimeChart.setData( res.data );
            this.exceptionsChart.setData( res.data );
        },
    },
};
</script>

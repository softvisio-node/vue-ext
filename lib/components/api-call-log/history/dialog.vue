<template>
    <ext-dialog closeAction="hide" height="95%" layout="vbox" scrollable="true" :title="title" viewModel="true" width="95%">
        <ext-toolbar docked="top">
            <ext-spacer/>
            <ext-button iconCls="fa-solid fa-redo" :text="i18nd(`vue-ext`, `Refresh`)" @tap="refresh"/>
        </ext-toolbar>

        <Amcharts5 height="250" @ready="_createLoadChart"/>
        <Amcharts5 height="250" @ready="_createRuntimeChart"/>
        <Amcharts5 height="250" @ready="_createExceptionsChart"/>
    </ext-dialog>
</template>

<script>
import Amcharts5 from "#vue/components/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";

export default {
    "components": { Amcharts5 },

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
            cmp.updateChart = this._updateChart.bind( this );

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

            chart.set(
                "cursor",
                am5xy.XYCursor.new( root, {
                    "behavior": "zoomX",
                } )
            );

            // add scrollbar, https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
            chart.set(
                "scrollbarX",
                am5.Scrollbar.new( root, {
                    "orientation": "horizontal",
                } )
            );

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

        _createRuntimeChart ( cmp ) {
            cmp.updateChart = this._updateChart.bind( this );

            this._runtimeChart = cmp;

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

            chart.set(
                "cursor",
                am5xy.XYCursor.new( root, {
                    "behavior": "zoomX",
                } )
            );

            // add scrollbar, https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
            chart.set(
                "scrollbarX",
                am5.Scrollbar.new( root, {
                    "orientation": "horizontal",
                } )
            );

            chart.children.unshift( am5.Label.new( root, {
                "text": "Average Runtime for Last 30 Days",
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
                "name": "Runtime",
                "xAxis": xAxis,
                "yAxis": yAxis,
                "valueXField": "date",
                "valueYField": "avg_runtime",
                "stroke": "green",
                "fill": "green",
                "stacked": true,
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": "Average runtime: {valueY} sec.",
                } ),
            } ) );

            series1.data.processor = am5.DataProcessor.new( root, {
                "dateFields": ["date"],
                "dateFormat": "i",
            } );

            this.refresh();
        },

        _createExceptionsChart ( cmp ) {
            cmp.updateChart = this._updateChart.bind( this );

            this._exceptionsChart = cmp;

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

            chart.set(
                "cursor",
                am5xy.XYCursor.new( root, {
                    "behavior": "zoomX",
                } )
            );

            // add scrollbar, https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
            chart.set(
                "scrollbarX",
                am5.Scrollbar.new( root, {
                    "orientation": "horizontal",
                } )
            );

            chart.children.unshift( am5.Label.new( root, {
                "text": "Exceptions Percent for Last 30 Days",
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
                "name": "Exceptions",
                "xAxis": xAxis,
                "yAxis": yAxis,
                "valueXField": "date",
                "valueYField": "errors_percent",
                "stroke": "red",
                "fill": "red",
                "stacked": true,
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": "Exceptions: {valueY}%",
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
            if ( !this.record || !this._loadChart || !this._runtimeChart || !this._exceptionsChart ) return;

            this.ext.mask();

            const res = await this.$api.call( "admin/api-call-log/get-history-stats", this.record.id );

            this.ext.unmask();

            if ( !res.ok ) {
                this.$utils.toast( res );

                this.ext.hide();
            }

            this._loadChart.setData( res.data );
            this._runtimeChart.setData( res.data );
            this._exceptionsChart.setData( res.data );
        },
    },
};
</script>

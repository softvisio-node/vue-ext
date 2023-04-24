<template>
    <ext-dialog height="95%" layout="fit" scrollable="true" :title="title" viewModel="true" width="95%">
        <CardsPanel ref="cardsPanel" @reload="reload">
            <template #docked>
                <ext-toolbar docked="top">
                    <ext-spacer/>
                    <ext-button iconCls="fa-solid fa-redo" :text="i18nd(`vue-ext`, `Refresh`)" @tap="reload"/>
                </ext-toolbar>
            </template>

            <template #data>
                <ext-container layput="vbox" scrollable="true">
                    <Amcharts5 height="250" @ready="_createLoadChart"/>
                    <Amcharts5 height="250" @ready="_createRuntimeChart"/>
                    <Amcharts5 height="250" @ready="_createExceptionsChart"/>
                </ext-container>
            </template>
        </CardsPanel>
    </ext-dialog>
</template>

<script>
import CardsPanel from "#src/components/cards.panel";
import Amcharts5 from "#vue/components/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";

export default {
    "components": { CardsPanel, Amcharts5 },

    "props": {
        "methodId": {
            "type": String,
            "required": true,
        },
    },

    "computed": {
        title () {
            return this.i18nd( "vue-ext", msgid`History for method "${this.methodId}"` );
        },
    },

    "methods": {
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
        },

        _updateChart ( cmp, data ) {
            const chart = cmp.root.container.children.values[0];

            chart.xAxes.values[0].data.setAll( data || [] );

            for ( const serie of chart.series ) {
                serie.data.setAll( data || [] );
            }
        },

        async reload () {
            this.$refs.cardsPanel.mask();

            const res = await this.$api.call( "admin/api-call-log/get-history-stats", this.methodId );

            this.$refs.cardsPanel.unmask();

            if ( !res.ok ) {
                this.$refs.cardsPanel.setResult( res );
            }
            else if ( !res.data?.length ) {
                this.$refs.cardsPanel.showNoDataCard();
            }
            else {
                this.$refs.cardsPanel.setResult( res );

                this._loadChart.setData( res.data );
                this._runtimeChart.setData( res.data );
                this._exceptionsChart.setData( res.data );
            }
        },
    },
};
</script>

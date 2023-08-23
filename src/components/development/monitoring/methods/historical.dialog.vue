<template>
    <ext-dialog height="90%" layout="fit" scrollable="true" :title="title" viewModel="true" width="90%">
        <CardsPanel ref="cardsPanel" @refresh="refresh">
            <template #docked>
                <ext-toolbar docked="top">
                    <ext-spacer/>
                    <ext-button iconCls="fa-solid fa-redo" :text="l10nd(`vue-ext`, `Refresh`)" @tap="refresh"/>
                </ext-toolbar>
            </template>

            <template #data>
                <ext-container layput="vbox" scrollable="true">
                    <Amcharts5 ref="callsChart" :createChart="_createCallsChart" height="250"/>
                    <Amcharts5 ref="durationChart" :createChart="_createDurationChart" height="250"/>
                    <Amcharts5 ref="exceptionsChart" :createChart="_createExceptionsChart" height="250"/>
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
        "record": {
            "type": Object,
            "required": true,
        },
    },

    "computed": {
        title () {
            return this.l10nd( "vue-ext", msgid`Historical charts for the method: ${this.record.get( "method_name" )}` );
        },
    },

    "methods": {
        _createCallsChart ( cmp ) {
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

            chart.children.push( am5.Label.new( root, {
                "text": this.l10nd( "vue-ext", "Calls for the last 30 days" ),
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
                "name": "Calls",
                "xAxis": xAxis,
                "yAxis": yAxis,
                "valueXField": "date",
                "valueYField": "calls",
                "stroke": "green",
                "fill": "green",
                "stacked": true,
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": this.l10nd( "vue-ext", "Calls" ) + ": {valueY}",
                } ),
            } ) );

            // chart.series.push( am5xy.ColumnSeries.new( root, {
            //     "name": "Declined",
            //     "xAxis": xAxis,
            //     "yAxis": yAxis,
            //     "valueXField": "date",
            //     "valueYField": "total_declined",
            //     "fill": "red",
            //     "stroke": "red",
            //     "stacked": true,
            //     "tooltip": am5.Tooltip.new( root, {
            //         "labelText": "Declined requests: {valueY}",
            //     } ),
            // } ) );

            series1.data.processor = am5.DataProcessor.new( root, {
                "dateFields": ["date"],
                "dateFormat": "i",
            } );

            // const legend = chart.children.push( am5.Legend.new( root, {
            //     "x": am5.percent( 50 ),
            //     "centerX": am5.percent( 50 ),
            // } ) );

            // legend.data.setAll( chart.series.values );
        },

        _createDurationChart ( cmp ) {
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

            chart.children.push( am5.Label.new( root, {
                "text": this.l10nd( "vue-ext", "Average duration per call for the last 30 days (ms)" ),
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
                "valueYField": "duration_per_call",
                "stroke": "green",
                "fill": "green",
                "stacked": true,
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": this.l10nd( "vue-ext", "Duration" ) + ": {valueY} ms",
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

            chart.children.push( am5.Label.new( root, {
                "text": this.l10nd( "vue-ext", "Exceptions percent for the last 30 days (%)" ),
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
                "valueYField": "exceptions_percent",
                "stroke": "red",
                "fill": "red",
                "stacked": true,
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": this.l10nd( "vue-ext", "Exceptions" ) + ": {valueY}%",
                } ),
            } ) );

            // chart.series.push( am5xy.ColumnSeries.new( root, {
            //     "name": "Declined",
            //     "xAxis": xAxis,
            //     "yAxis": yAxis,
            //     "valueXField": "date",
            //     "valueYField": "total_declined",
            //     "fill": "red",
            //     "stroke": "red",
            //     "stacked": true,
            //     "tooltip": am5.Tooltip.new( root, {
            //         "labelText": "Declined requests: {valueY}",
            //     } ),
            // } ) );

            series1.data.processor = am5.DataProcessor.new( root, {
                "dateFields": ["date"],
                "dateFormat": "i",
            } );
        },

        async refresh () {
            this.$refs.cardsPanel.mask();

            const res = await this.$api.call( "development/monitoring/methods/get-historical-time-series", this.record.id );

            this.$refs.cardsPanel.unmask();

            if ( !res.ok ) {
                this.$refs.cardsPanel.setResult( res );
            }
            else if ( !res.data?.length ) {
                this.$refs.cardsPanel.showNoDataCard();
            }
            else {
                this.$refs.cardsPanel.setResult( res );

                this.$refs.callsChart.setData( res.data );
                this.$refs.durationChart.setData( res.data );
                this.$refs.exceptionsChart.setData( res.data );
            }
        },
    },
};
</script>

<template>
    <CardsPanel ref="cardsPanel" scrollable="true" @refresh="refresh">
        <template #docked>
            <ext-toolbar docked="top">
                <ext-container :html="title"/>
                <ext-spacer/>
                <ext-button iconCls="fa-solid fa-redo" :text="i18nd(`vue-ext`, `Refresh`)" @tap="refresh"/>
            </ext-toolbar>
        </template>

        <template #data>
            <ext-container layput="vbox" scrollable="true">
                <Amcharts5 ref="callsChart" :createChart="_createCallsChart" height="150" :updateChart="_updateChart" @chartReady="_chartReady"/>
                <Amcharts5 ref="durationChart" :createChart="_createDurationChart" height="150" :updateChart="_updateChart" @chartReady="_chartReady"/>
                <Amcharts5 ref="exceptionsChart" :createChart="_createExceptionsChart" height="150" :updateChart="_updateChart" @chartReady="_chartReady"/>
            </ext-container>
        </template>
    </CardsPanel>
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
            return this.i18nd( "vue-ext", msgid`API method: ${this.methodId}` );
        },
    },

    "watch": {
        methodId ( newValue, OldValue ) {
            if ( newValue !== OldValue ) this.refresh();
        },
    },

    "methods": {
        _createCallsChart ( cmp ) {
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

            chart.children.unshift( am5.Label.new( root, {
                "text": this.i18nd( "vue-ext", "Calls for the last 60 minutes" ),
                "fontSize": 12,
                "x": am5.percent( 50 ),
                "centerX": am5.percent( 50 ),
            } ) );

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
                "valueYField": "calls",
                "fill": "green",
                "stroke": "green",
                "stacked": true,
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": this.i18nd( "vue-ext", "Calls" ) + ": {valueY}",
                } ),
            } ) );

            series1.data.processor = am5.DataProcessor.new( root, {
                "dateFields": ["date"],
                "dateFormat": "i",
            } );
        },

        _createDurationChart ( cmp ) {
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

            chart.children.unshift( am5.Label.new( root, {
                "text": this.i18nd( "vue-ext", "Average duration per call for the last 60 minutes (ms)" ),
                "fontSize": 12,
                "x": am5.percent( 50 ),
                "centerX": am5.percent( 50 ),
            } ) );

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
                "valueYField": "duration_per_call",
                "fill": "green",
                "stroke": "green",
                "stacked": true,
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": this.i18nd( "vue-ext", "Duration" ) + ": {valueY} ms",
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

            chart.children.unshift( am5.Label.new( root, {
                "text": this.i18nd( "vue-ext", "Exceptions percent for the last 60 minutes (%)" ),
                "fontSize": 12,
                "x": am5.percent( 50 ),
                "centerX": am5.percent( 50 ),
            } ) );

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
                "valueYField": "exceptions_percent",
                "valueXField": "date",
                "fill": "red",
                "stroke": "red",
                "stacked": true,
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": this.i18nd( "vue-ext", "Exceptions" ) + ": {valueY}%",
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

        // XXX
        _chartReady () {
            this.refresh();
        },

        async refresh () {
            if ( !this.methodId ) {
                this.$refs.cardsPanel.showNoDataCard();

                return;
            }

            const callsChart = this.$refs.callsChart,
                durationChart = this.$refs.durationChart,
                exceptionsChart = this.$refs.exceptionsChart;

            // XXX
            this.$refs.cardsPanel.setResult( { "ok": 1 } );
            if ( !callsChart.chartReady || !durationChart.chartReady || !exceptionsChart.chartReady ) return;

            this.$refs.cardsPanel.mask();

            const res = await this.$api.call( "administration/api-status/get-latest-time-series", this.methodId );

            this.$refs.cardsPanel.unmask();

            if ( !res.ok ) {
                this.$refs.cardsPanel.setResult( res );
            }
            else if ( !res.data?.length ) {
                this.$refs.cardsPanel.showNoDataCard();
            }
            else {
                this.$refs.cardsPanel.setResult( res );

                callsChart.setData( res.data );
                durationChart.setData( res.data );
                exceptionsChart.setData( res.data );
            }
        },
    },
};
</script>

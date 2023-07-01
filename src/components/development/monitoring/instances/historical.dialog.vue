<template>
    <ext-dialog height="90%" layout="fit" scrollable="true" :title="title" viewModel="true" width="90%">
        <CardsPanel ref="cardsPanel" @refresh="refresh">
            <template #docked>
                <ext-toolbar docked="top">
                    <ext-spacer/>
                    <ext-button iconCls="fa-solid fa-redo" :text="i18nd(`vue-ext`, `Refresh`)" @tap="refresh"/>
                </ext-toolbar>
            </template>

            <template #data>
                <ext-container layput="vbox" scrollable="true">
                    <Amcharts5 ref="cpuUserChart" :createChart="_createCpuUserChart" height="150" :updateChart="_updateChart" @refresh="_chartRefresh"/>

                    <Amcharts5 ref="cpuSystemChart" :createChart="_createCpuSystemChart" height="150" :updateChart="_updateChart" @refresh="_chartRefresh"/>

                    <Amcharts5 ref="memryFreeChart" :createChart="_createMemryFreeChart" height="150" :updateChart="_updateChart" @refresh="_chartRefresh"/>

                    <Amcharts5 ref="memryRssChart" :createChart="_createMemryRssChart" height="150" :updateChart="_updateChart" @refresh="_chartRefresh"/>

                    <Amcharts5 ref="fsFreeChart" :createChart="_createFsFreeChart" height="150" :updateChart="_updateChart" @refresh="_chartRefresh"/>
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
            return this.i18nd( "vue-ext", msgid`Historical charts for the method: ${this.record.get( "method_name" )}` );
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

            chart.children.unshift( am5.Label.new( root, {
                "text": this.i18nd( "vue-ext", "Calls for the last 30 days" ),
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
                    "labelText": this.i18nd( "vue-ext", "Calls" ) + ": {valueY}",
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

            chart.children.unshift( am5.Label.new( root, {
                "text": this.i18nd( "vue-ext", "Average duration per call for the last 30 days (ms)" ),
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
                "text": this.i18nd( "vue-ext", "Exceptions percent for the last 30 days (%)" ),
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
                    "labelText": this.i18nd( "vue-ext", "Exceptions" ) + ": {valueY}%",
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

        _updateChart ( cmp, data ) {
            const chart = cmp.root.container.children.values[0];

            chart.xAxes.values[0].data.setAll( data || [] );

            for ( const serie of chart.series ) {
                serie.data.setAll( data || [] );
            }
        },

        _chartRefresh () {
            if ( this.$refs.cpuUserChart.hasData ) return;
            if ( this.$refs.cpuSystenChart.hasData ) return;
            if ( this.$refs.memryFreeChart.hasData ) return;
            if ( this.$refs.memryRssChart.hasData ) return;
            if ( this.$refs.fsFreeChart.hasData ) return;

            this.refresh();
        },

        async refresh () {
            this.$refs.cardsPanel.mask();

            const res = await this.$api.call( "development/monitoring/instances/get-historical-time-series", this.record.id );

            this.$refs.cardsPanel.unmask();

            if ( !res.ok ) {
                this.$refs.cardsPanel.setResult( res );
            }
            else if ( !res.data?.length ) {
                this.$refs.cardsPanel.showNoDataCard();
            }
            else {
                this.$refs.cardsPanel.setResult( res );

                this.$refs.cpuUserChart.setData( res.data );
                this.$refs.cpuSystemChart.setData( res.data );
                this.$refs.memryFreeChart.setData( res.data );
                this.$refs.memryRssChart.setData( res.data );
                this.$refs.fsFreeChart.setData( res.data );
            }
        },
    },
};
</script>

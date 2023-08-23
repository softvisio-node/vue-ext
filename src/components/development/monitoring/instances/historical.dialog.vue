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
                    <AmchartsPanel ref="cpuUserChart" :createChart="_createCpuUserChart" height="250"/>

                    <AmchartsPanel ref="cpuSystemChart" :createChart="_createCpuSystemChart" height="250"/>

                    <AmchartsPanel ref="memryFreeChart" :createChart="_createMemoryFreeChart" height="250"/>

                    <AmchartsPanel ref="memryRssChart" :createChart="_createMemoryRssChart" height="250"/>

                    <AmchartsPanel ref="fsFreeChart" :createChart="_createFsFreeChart" height="250"/>
                </ext-container>
            </template>
        </CardsPanel>
    </ext-dialog>
</template>

<script>
import CardsPanel from "#src/components/cards.panel";
import AmchartsPanel from "#vue/components/amcharts5/panel";
import * as am5xy from "@amcharts/amcharts5/xy";

export default {
    "components": { CardsPanel, AmchartsPanel },

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
        _createCpuUserChart ( cmp ) {
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
                "text": this.l10nd( "vue-ext", "CPU (user) for the last 30 days" ),
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
                "name": "cpuUser",
                "xAxis": xAxis,
                "yAxis": yAxis,
                "valueXField": "date",
                "valueYField": "cpu_user",
                "stroke": "green",
                "fill": "green",
                "stacked": true,
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": this.l10nd( "vue-ext", "CPU (user)" ) + ": {valueY}",
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

        _createCpuSystemChart ( cmp ) {
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
                "text": this.l10nd( "vue-ext", "CPU (system) for the last 30 days" ),
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
                "name": "cpuSystem",
                "xAxis": xAxis,
                "yAxis": yAxis,
                "valueXField": "date",
                "valueYField": "cpu_system",
                "stroke": "green",
                "fill": "green",
                "stacked": true,
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": this.l10nd( "vue-ext", "CPU (system)" ) + ": {valueY}",
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

        _createMemoryFreeChart ( cmp ) {
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
                "text": this.l10nd( "vue-ext", "Free memory (MB) for the last 30 days" ),
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
                "name": "memoryFree",
                "xAxis": xAxis,
                "yAxis": yAxis,
                "valueXField": "date",
                "valueYField": "memory_free",
                "stroke": "green",
                "fill": "green",
                "stacked": true,
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": this.l10nd( "vue-ext", "Free memory" ) + ": {valueY} MB",
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

        _createMemoryRssChart ( cmp ) {
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
                "text": this.l10nd( "vue-ext", "RSS memory (MB) for the last 30 days" ),
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
                "name": "memoryRss",
                "xAxis": xAxis,
                "yAxis": yAxis,
                "valueXField": "date",
                "valueYField": "fmemory_rss",
                "stroke": "green",
                "fill": "green",
                "stacked": true,
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": this.l10nd( "vue-ext", "RSS memory" ) + ": {valueY} MB",
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

        _createFsFreeChart ( cmp ) {
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
                "text": this.l10nd( "vue-ext", "File system free space (MB) for the last 30 days" ),
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
                "name": "fsFree",
                "xAxis": xAxis,
                "yAxis": yAxis,
                "valueXField": "date",
                "valueYField": "fs_free",
                "stroke": "green",
                "fill": "green",
                "stacked": true,
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": this.l10nd( "vue-ext", "Free" ) + ": {valueY} MB",
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

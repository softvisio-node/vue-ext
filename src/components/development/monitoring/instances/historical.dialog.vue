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
                <ext-container defaults='{"height":300}' layput="vbox" scrollable="true">
                    <AmchartsPanel ref="cpuUserChart" :createChart="_createCpuUserChart"/>

                    <AmchartsPanel ref="cpuSystemChart" :createChart="_createCpuSystemChart"/>

                    <AmchartsPanel ref="memryUsedChart" :createChart="_createMemoryUsedChart"/>

                    <AmchartsPanel ref="memryRssChart" :createChart="_createMemoryRssChart"/>

                    <AmchartsPanel ref="fsUsedChart" :createChart="_createFsUsedChart"/>
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
            return this.l10nd( "vue-ext", `Instance historical stats` );
        },
    },

    "methods": {
        _createCpuUserChart ( cmp ) {
            const root = cmp.root,
                am5 = cmp.am5;

            // chart
            const chart = root.container.children.push( am5xy.XYChart.new( root, {
                "layout": root.verticalLayout,
                "panX": true,
                "pinchZoomX": true,
                "wheelX": "panX",
                "wheelY": "none",
            } ) );

            // title
            chart.children.unshift( am5.Label.new( root, {
                "text": this.l10nd( `vue-ext`, `CPU (user) for the last 30 days` ),
                "fontSize": 12,
                "x": am5.percent( 50 ),
                "centerX": am5.percent( 50 ),
            } ) );

            // x axis
            const xAxis = chart.xAxes.push( am5xy.DateAxis.new( root, {
                "maxDeviation": 0,
                "baseInterval": {
                    "timeUnit": "hour",
                    "count": 1,
                },
                "renderer": am5xy.AxisRendererX.new( root, {} ),
                "tooltip": am5.Tooltip.new( root, {} ),
            } ) );

            // y axis 1
            const yAxis1 = chart.yAxes.push( am5xy.ValueAxis.new( root, {
                "renderer": am5xy.AxisRendererY.new( root, {} ),
                "tooltip": am5.Tooltip.new( root, {} ),
                "tooltipNumberFormat": {},
                "numberFormat": {},
            } ) );

            // data processor
            const dateProcessor = am5.DataProcessor.new( root, {
                "dateFields": ["date"],
                "dateFormat": "i",
            } );

            // serie 1
            const series1 = chart.series.push( am5xy.StepLineSeries.new( root, {
                "name": this.l10nd( `vue-ext`, `CPU (user)` ),
                xAxis,
                "yAxis": yAxis1,
                "valueXField": "date",
                "valueYField": "cpu_user",
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": this.l10nd( `vue-ext`, `CPU (user)` ) + ": {valueY}",
                } ),
                "stroke": am5.color( "#00ff00" ),
                "fill": am5.color( "#00ff00" ),
                "connect": false,
            } ) );

            // data processor
            series1.data.processor = dateProcessor;

            // fill settings
            series1.fills.template.setAll( {
                "fillOpacity": 0.3,
                "visible": true,
            } );

            // cursor
            chart.set(
                "cursor",
                am5xy.XYCursor.new( root, {
                    "behavior": "zoomX",
                } )
            );

            // scroll bar
            chart.set(
                "scrollbarX",
                am5.Scrollbar.new( root, {
                    "orientation": "horizontal",
                } )
            );

            // legend
            const legend = chart.children.push( am5.Legend.new( root, {
                "centerX": am5.p50,
                "x": am5.p50,
            } ) );

            legend.data.setAll( chart.series.values );
        },

        _createCpuSystemChart ( cmp ) {
            const root = cmp.root,
                am5 = cmp.am5;

            // chart
            const chart = root.container.children.push( am5xy.XYChart.new( root, {
                "layout": root.verticalLayout,
                "panX": true,
                "pinchZoomX": true,
                "wheelX": "panX",
                "wheelY": "none",
            } ) );

            // title
            chart.children.unshift( am5.Label.new( root, {
                "text": this.l10nd( `vue-ext`, `CPU (system) for the last 30 days` ),
                "fontSize": 12,
                "x": am5.percent( 50 ),
                "centerX": am5.percent( 50 ),
            } ) );

            // x axis
            const xAxis = chart.xAxes.push( am5xy.DateAxis.new( root, {
                "maxDeviation": 0,
                "baseInterval": {
                    "timeUnit": "hour",
                    "count": 1,
                },
                "renderer": am5xy.AxisRendererX.new( root, {} ),
                "tooltip": am5.Tooltip.new( root, {} ),
            } ) );

            // y axis 1
            const yAxis1 = chart.yAxes.push( am5xy.ValueAxis.new( root, {
                "renderer": am5xy.AxisRendererY.new( root, {} ),
                "tooltip": am5.Tooltip.new( root, {} ),
                "tooltipNumberFormat": {},
                "numberFormat": {},
            } ) );

            // data processor
            const dateProcessor = am5.DataProcessor.new( root, {
                "dateFields": ["date"],
                "dateFormat": "i",
            } );

            // serie 1
            const series1 = chart.series.push( am5xy.StepLineSeries.new( root, {
                "name": this.l10nd( `vue-ext`, `CPU (system)` ),
                xAxis,
                "yAxis": yAxis1,
                "valueXField": "date",
                "valueYField": "cpu_system",
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": this.l10nd( `vue-ext`, `CPU (system)` ) + ": {valueY}",
                } ),
                "stroke": am5.color( "#00ff00" ),
                "fill": am5.color( "#00ff00" ),
                "connect": false,
            } ) );

            // data processor
            series1.data.processor = dateProcessor;

            // fill settings
            series1.fills.template.setAll( {
                "fillOpacity": 0.3,
                "visible": true,
            } );

            // cursor
            chart.set(
                "cursor",
                am5xy.XYCursor.new( root, {
                    "behavior": "zoomX",
                } )
            );

            // scroll bar
            chart.set(
                "scrollbarX",
                am5.Scrollbar.new( root, {
                    "orientation": "horizontal",
                } )
            );

            // legend
            const legend = chart.children.push( am5.Legend.new( root, {
                "centerX": am5.p50,
                "x": am5.p50,
            } ) );

            legend.data.setAll( chart.series.values );
        },

        _createMemoryUsedChart ( cmp ) {
            const root = cmp.root,
                am5 = cmp.am5;

            // chart
            const chart = root.container.children.push( am5xy.XYChart.new( root, {
                "layout": root.verticalLayout,
                "panX": true,
                "pinchZoomX": true,
                "wheelX": "panX",
                "wheelY": "none",
            } ) );

            // title
            chart.children.unshift( am5.Label.new( root, {
                "text": this.l10nd( `vue-ext`, `Used memory (MB) for the last 30 days` ),
                "fontSize": 12,
                "x": am5.percent( 50 ),
                "centerX": am5.percent( 50 ),
            } ) );

            // x axis
            const xAxis = chart.xAxes.push( am5xy.DateAxis.new( root, {
                "maxDeviation": 0,
                "baseInterval": {
                    "timeUnit": "hour",
                    "count": 1,
                },
                "renderer": am5xy.AxisRendererX.new( root, {} ),
                "tooltip": am5.Tooltip.new( root, {} ),
            } ) );

            // y axis 1
            const yAxis1 = chart.yAxes.push( am5xy.ValueAxis.new( root, {
                "renderer": am5xy.AxisRendererY.new( root, {} ),
                "tooltip": am5.Tooltip.new( root, {} ),
                "tooltipNumberFormat": { "style": "unit", "unit": "megabyte" },
                "numberFormat": { "style": "unit", "unit": "megabyte" },
            } ) );

            // y axis 2
            const yAxis2 = chart.yAxes.push( am5xy.ValueAxis.new( root, {
                "min": 0,
                "max": 1,
                "renderer": am5xy.AxisRendererY.new( root, {
                    "opposite": true,
                } ),
                "tooltip": am5.Tooltip.new( root, {} ),
                "tooltipNumberFormat": { "style": "percent", "maximumFractionDigits": 0 },
                "numberFormat": { "style": "percent", "maximumFractionDigits": 0 },
            } ) );

            // data processor
            const dateProcessor = am5.DataProcessor.new( root, {
                "dateFields": ["date"],
                "dateFormat": "i",
            } );

            // serie 1
            const series1 = chart.series.push( am5xy.StepLineSeries.new( root, {
                "name": this.l10nd( `vue-ext`, `Used memory (MB)` ),
                xAxis,
                "yAxis": yAxis1,
                "valueXField": "date",
                "valueYField": "memory_used",
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": this.l10nd( `vue-ext`, `Used memory` ) + ": {valueY.formatNumber()}",
                } ),
                "stroke": am5.color( "#00ff00" ),
                "fill": am5.color( "#00ff00" ),
                "connect": false,
            } ) );

            // data processor
            series1.data.processor = dateProcessor;

            // serie tooltip label formatters
            series1.get( "tooltip" ).label.set(
                "numberFormatter",
                am5.NumberFormatter.new( root, {
                    "numberFormat": { "style": "unit", "unit": "megabyte" },
                } )
            );

            // fill settings
            series1.fills.template.setAll( {
                "fillOpacity": 0.3,
                "visible": true,
            } );

            // serie 2
            const series2 = chart.series.push( am5xy.StepLineSeries.new( root, {
                "name": this.l10nd( `vue-ext`, `Used memory (%)` ),
                xAxis,
                "yAxis": yAxis2,
                "valueXField": "date",
                "valueYField": "memory_used_percent",
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": this.l10nd( `vue-ext`, `Used memory` ) + ": {valueY.formatNumber()}",
                } ),
                "stroke": am5.color( "#ff0000" ),
                "connect": true,
            } ) );

            // data processor
            series2.data.processor = dateProcessor;

            // serie tooltip label formatters
            series2.get( "tooltip" ).label.set(
                "numberFormatter",
                am5.NumberFormatter.new( root, {
                    "numberFormat": { "style": "percent" },
                } )
            );

            // stroke settings
            series2.strokes.template.setAll( {
                "strokeWidth": 3,
            } );

            // cursor
            chart.set(
                "cursor",
                am5xy.XYCursor.new( root, {
                    "behavior": "zoomX",
                } )
            );

            // scroll bar
            chart.set(
                "scrollbarX",
                am5.Scrollbar.new( root, {
                    "orientation": "horizontal",
                } )
            );

            // legend
            const legend = chart.children.push( am5.Legend.new( root, {
                "centerX": am5.p50,
                "x": am5.p50,
            } ) );

            legend.data.setAll( chart.series.values );
        },

        _createMemoryRssChart ( cmp ) {
            const root = cmp.root,
                am5 = cmp.am5;

            // chart
            const chart = root.container.children.push( am5xy.XYChart.new( root, {
                "layout": root.verticalLayout,
                "panX": true,
                "pinchZoomX": true,
                "wheelX": "panX",
                "wheelY": "none",
            } ) );

            // title
            chart.children.unshift( am5.Label.new( root, {
                "text": this.l10nd( `vue-ext`, `RSS memory (MB) for the last 30 days` ),
                "fontSize": 12,
                "x": am5.percent( 50 ),
                "centerX": am5.percent( 50 ),
            } ) );

            // x axis
            const xAxis = chart.xAxes.push( am5xy.DateAxis.new( root, {
                "maxDeviation": 0,
                "baseInterval": {
                    "timeUnit": "hour",
                    "count": 1,
                },
                "renderer": am5xy.AxisRendererX.new( root, {} ),
                "tooltip": am5.Tooltip.new( root, {} ),
            } ) );

            // y axis 1
            const yAxis1 = chart.yAxes.push( am5xy.ValueAxis.new( root, {
                "renderer": am5xy.AxisRendererY.new( root, {} ),
                "tooltip": am5.Tooltip.new( root, {} ),
                "tooltipNumberFormat": { "style": "unit", "unit": "megabyte" },
                "numberFormat": { "style": "unit", "unit": "megabyte" },
            } ) );

            // y axis 2
            const yAxis2 = chart.yAxes.push( am5xy.ValueAxis.new( root, {
                "min": 0,
                "max": 1,
                "renderer": am5xy.AxisRendererY.new( root, {
                    "opposite": true,
                } ),
                "tooltip": am5.Tooltip.new( root, {} ),
                "tooltipNumberFormat": { "style": "percent", "maximumFractionDigits": 0 },
                "numberFormat": { "style": "percent", "maximumFractionDigits": 0 },
            } ) );

            // data processor
            const dateProcessor = am5.DataProcessor.new( root, {
                "dateFields": ["date"],
                "dateFormat": "i",
            } );

            // serie 1
            const series1 = chart.series.push( am5xy.StepLineSeries.new( root, {
                "name": this.l10nd( `vue-ext`, `RSS memory (MB)` ),
                xAxis,
                "yAxis": yAxis1,
                "valueXField": "date",
                "valueYField": "memory_rss",
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": this.l10nd( `vue-ext`, `RSS memory` ) + ": {valueY.formatNumber()}",
                } ),
                "stroke": am5.color( "#00ff00" ),
                "fill": am5.color( "#00ff00" ),
                "connect": false,
            } ) );

            // data processor
            series1.data.processor = dateProcessor;

            // serie tooltip label formatters
            series1.get( "tooltip" ).label.set(
                "numberFormatter",
                am5.NumberFormatter.new( root, {
                    "numberFormat": { "style": "unit", "unit": "megabyte" },
                } )
            );

            // fill settings
            series1.fills.template.setAll( {
                "fillOpacity": 0.3,
                "visible": true,
            } );

            // serie 2
            const series2 = chart.series.push( am5xy.StepLineSeries.new( root, {
                "name": this.l10nd( `vue-ext`, `RSS memory (%)` ),
                xAxis,
                "yAxis": yAxis2,
                "valueXField": "date",
                "valueYField": "memory_rss_percent",
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": this.l10nd( `vue-ext`, `RSS memory` ) + ": {valueY.formatNumber()}",
                } ),
                "stroke": am5.color( "#ff0000" ),
                "connect": true,
            } ) );

            // data processor
            series2.data.processor = dateProcessor;

            // serie tooltip label formatters
            series2.get( "tooltip" ).label.set(
                "numberFormatter",
                am5.NumberFormatter.new( root, {
                    "numberFormat": { "style": "percent" },
                } )
            );

            // stroke settings
            series2.strokes.template.setAll( {
                "strokeWidth": 3,
            } );

            // cursor
            chart.set(
                "cursor",
                am5xy.XYCursor.new( root, {
                    "behavior": "zoomX",
                } )
            );

            // scroll bar
            chart.set(
                "scrollbarX",
                am5.Scrollbar.new( root, {
                    "orientation": "horizontal",
                } )
            );

            // legend
            const legend = chart.children.push( am5.Legend.new( root, {
                "centerX": am5.p50,
                "x": am5.p50,
            } ) );

            legend.data.setAll( chart.series.values );
        },

        _createFsUsedChart ( cmp ) {
            const root = cmp.root,
                am5 = cmp.am5;

            // chart
            const chart = root.container.children.push( am5xy.XYChart.new( root, {
                "layout": root.verticalLayout,
                "panX": true,
                "pinchZoomX": true,
                "wheelX": "panX",
                "wheelY": "none",
            } ) );

            // title
            chart.children.unshift( am5.Label.new( root, {
                "text": this.l10nd( `vue-ext`, `FS used (MB) for the last 30 days` ),
                "fontSize": 12,
                "x": am5.percent( 50 ),
                "centerX": am5.percent( 50 ),
            } ) );

            // x axis
            const xAxis = chart.xAxes.push( am5xy.DateAxis.new( root, {
                "maxDeviation": 0,
                "baseInterval": {
                    "timeUnit": "hour",
                    "count": 1,
                },
                "renderer": am5xy.AxisRendererX.new( root, {} ),
                "tooltip": am5.Tooltip.new( root, {} ),
            } ) );

            // y axis 1
            const yAxis1 = chart.yAxes.push( am5xy.ValueAxis.new( root, {
                "renderer": am5xy.AxisRendererY.new( root, {} ),
                "tooltip": am5.Tooltip.new( root, {} ),
                "tooltipNumberFormat": { "style": "unit", "unit": "megabyte" },
                "numberFormat": { "style": "unit", "unit": "megabyte" },
            } ) );

            // y axis 2
            const yAxis2 = chart.yAxes.push( am5xy.ValueAxis.new( root, {
                "min": 0,
                "max": 1,
                "renderer": am5xy.AxisRendererY.new( root, {
                    "opposite": true,
                } ),
                "tooltip": am5.Tooltip.new( root, {} ),
                "tooltipNumberFormat": { "style": "percent", "maximumFractionDigits": 0 },
                "numberFormat": { "style": "percent", "maximumFractionDigits": 0 },
            } ) );

            // data processor
            const dateProcessor = am5.DataProcessor.new( root, {
                "dateFields": ["date"],
                "dateFormat": "i",
            } );

            // serie 1
            const series1 = chart.series.push( am5xy.SmoothedXLineSeries.new( root, {
                "name": this.l10nd( `vue-ext`, `FS used (MB)` ),
                xAxis,
                "yAxis": yAxis1,
                "valueXField": "date",
                "valueYField": "fs_used",
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": this.l10nd( `vue-ext`, `FS used` ) + ": {valueY.formatNumber()}",
                } ),
                "stroke": am5.color( "#00ff00" ),
                "fill": am5.color( "#00ff00" ),
                "connect": true,
            } ) );

            // data processor
            series1.data.processor = dateProcessor;

            // serie tooltip label formatters
            series1.get( "tooltip" ).label.set(
                "numberFormatter",
                am5.NumberFormatter.new( root, {
                    "numberFormat": { "style": "unit", "unit": "megabyte" },
                } )
            );

            // fill settings
            series1.fills.template.setAll( {
                "fillOpacity": 0.3,
                "visible": true,
            } );

            // serie 2
            const series2 = chart.series.push( am5xy.StepLineSeries.new( root, {
                "name": this.l10nd( `vue-ext`, `FS used (%)` ),
                xAxis,
                "yAxis": yAxis2,
                "valueXField": "date",
                "valueYField": "fs_used_percent",
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": this.l10nd( `vue-ext`, `FS used` ) + ": {valueY.formatNumber()}",
                } ),
                "stroke": am5.color( "#ff0000" ),
                "connect": true,
            } ) );

            // data processor
            series2.data.processor = dateProcessor;

            // serie tooltip label formatters
            series2.get( "tooltip" ).label.set(
                "numberFormatter",
                am5.NumberFormatter.new( root, {
                    "numberFormat": { "style": "percent" },
                } )
            );

            // stroke settings
            series2.strokes.template.setAll( {
                "strokeWidth": 3,
            } );

            // cursor
            chart.set(
                "cursor",
                am5xy.XYCursor.new( root, {
                    "behavior": "zoomX",
                } )
            );

            // scroll bar
            chart.set(
                "scrollbarX",
                am5.Scrollbar.new( root, {
                    "orientation": "horizontal",
                } )
            );

            // legend
            const legend = chart.children.push( am5.Legend.new( root, {
                "centerX": am5.p50,
                "x": am5.p50,
            } ) );

            legend.data.setAll( chart.series.values );
        },

        async refresh () {
            this.$refs.cardsPanel.mask();

            const res = await this.$api.call( "development/monitoring/instances/get-instance-stats", this.record.id, "30 days" );

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
                this.$refs.memryUsedChart.setData( res.data );
                this.$refs.memryRssChart.setData( res.data );
                this.$refs.fsUsedChart.setData( res.data );
            }
        },
    },
};
</script>

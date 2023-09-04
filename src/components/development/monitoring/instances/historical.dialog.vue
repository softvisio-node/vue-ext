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
                "text": this.l10nd( "vue-ext", "CPU (user) for the last 30 days" ),
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
                "tooltipDateFormat": "I",
                "tooltip": am5.Tooltip.new( root, {} ),
            } ) );

            // y axis
            const yAxis = chart.yAxes.push( am5xy.ValueAxis.new( root, {
                "renderer": am5xy.AxisRendererY.new( root, {} ),
                "tooltip": am5.Tooltip.new( root, {} ),
            } ) );

            // series 1
            const series1 = chart.series.push( am5xy.StepLineSeries.new( root, {
                "name": this.l10nd( `vue-ext`, "CPU (user)" ),
                xAxis,
                yAxis,
                "valueXField": "date",
                "valueYField": "cpu_user",
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": this.l10nd( "vue-ext", "CPU (user)" ) + ": {valueY}",
                } ),
                "stroke": am5.color( "#00ff00" ),
                "fill": am5.color( "#00ff00" ),
            } ) );

            // fill settings
            series1.fills.template.setAll( {
                "fillOpacity": 0.3,
                "visible": true,
            } );

            // data processor
            series1.data.processor = am5.DataProcessor.new( root, {
                "dateFields": ["date"],
                "dateFormat": "i",
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
                "text": this.l10nd( "vue-ext", "CPU (system) for the last 30 days" ),
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
                "tooltipDateFormat": "I",
                "tooltip": am5.Tooltip.new( root, {} ),
            } ) );

            // y axis
            const yAxis = chart.yAxes.push( am5xy.ValueAxis.new( root, {
                "renderer": am5xy.AxisRendererY.new( root, {} ),
                "tooltip": am5.Tooltip.new( root, {} ),
            } ) );

            // series 1
            const series1 = chart.series.push( am5xy.StepLineSeries.new( root, {
                "name": this.l10nd( `vue-ext`, "CPU (system)" ),
                xAxis,
                yAxis,
                "valueXField": "date",
                "valueYField": "cpu_system",
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": this.l10nd( "vue-ext", "CPU (system)" ) + ": {valueY}",
                } ),
                "stroke": am5.color( "#00ff00" ),
                "fill": am5.color( "#00ff00" ),
            } ) );

            // fill settings
            series1.fills.template.setAll( {
                "fillOpacity": 0.3,
                "visible": true,
            } );

            // data processor
            series1.data.processor = am5.DataProcessor.new( root, {
                "dateFields": ["date"],
                "dateFormat": "i",
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
        },

        // XXX
        _createMemoryUsedChart ( cmp ) {
            const root = cmp.root,
                am5 = cmp.am5;

            root.dateFormatter.set( "dateFormat", {
                "weekday": "long",
                "year": "numeric",
                "month": "long",
                "day": "numeric",
            } );

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
                "text": this.l10nd( "vue-ext", "Used memory (MB) for the last 30 days" ),
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

            // XXX
            this.setDateAxis( xAxis );

            // y axis
            const yAxis = chart.yAxes.push( am5xy.ValueAxis.new( root, {
                "renderer": am5xy.AxisRendererY.new( root, {} ),
                "tooltip": am5.Tooltip.new( root, {} ),
                "tooltipNumberFormat": { "style": "unit", "unit": "megabyte" },
                "numberFormat": { "style": "unit", "unit": "megabyte" },
            } ) );

            const yAxisPercent = chart.yAxes.push( am5xy.ValueAxis.new( root, {
                "min": 0,
                "max": 100,
                "renderer": am5xy.AxisRendererY.new( root, {
                    "opposite": true,
                } ),
                "tooltip": am5.Tooltip.new( root, {} ),
                "tooltipNumberFormat": { "style": "percent", "maximumFractionDigits": 0 },
                "numberFormat": { "style": "percent", "maximumFractionDigits": 0 },
            } ) );

            // series 1
            const series1 = chart.series.push( am5xy.StepLineSeries.new( root, {
                "name": this.l10nd( `vue-ext`, "Used memory" ),
                xAxis,
                yAxis,
                "valueXField": "date",
                "valueYField": "memory_used",
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": this.l10nd( "vue-ext", "Used memory" ) + ": {valueY} MB",
                } ),
                "stroke": am5.color( "#00ff00" ),
                "fill": am5.color( "#00ff00" ),
                "connect": false,
            } ) );

            // fill settings
            series1.fills.template.setAll( {
                "fillOpacity": 0.3,
                "visible": true,
            } );

            // data processor
            series1.data.processor = am5.DataProcessor.new( root, {
                "dateFields": ["date"],
                "dateFormat": "i",
            } );

            const seriesPercent = chart.series.push( am5xy.StepLineSeries.new( root, {
                "name": this.l10nd( `vue-ext`, "Used memory (%)" ),
                xAxis,
                "yAxis": yAxisPercent,
                "valueXField": "date",
                "valueYField": "memory_used_percent",
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": this.l10nd( "vue-ext", "Used memory" ) + ": {valueY}%",
                } ),
                "stroke": am5.color( "#ff0000" ),
                "connect": true,
            } ) );

            seriesPercent.data.processor = am5.DataProcessor.new( root, {
                "dateFields": ["date"],
                "dateFormat": "i",
            } );

            seriesPercent.strokes.template.setAll( {
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
                "text": this.l10nd( "vue-ext", "RSS memory (MB) for the last 30 days" ),
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
                "tooltipDateFormat": "I",
                "tooltip": am5.Tooltip.new( root, {} ),
            } ) );

            // y axis
            const yAxis = chart.yAxes.push( am5xy.ValueAxis.new( root, {
                "renderer": am5xy.AxisRendererY.new( root, {} ),
                "tooltip": am5.Tooltip.new( root, {} ),
            } ) );

            // series 1
            const series1 = chart.series.push( am5xy.StepLineSeries.new( root, {
                "name": this.l10nd( `vue-ext`, "RSS memory" ),
                xAxis,
                yAxis,
                "valueXField": "date",
                "valueYField": "memory_rss",
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": this.l10nd( "vue-ext", "RSS memory" ) + ": {valueY} MB",
                } ),
                "stroke": am5.color( "#00ff00" ),
                "fill": am5.color( "#00ff00" ),
                "connect": false,
            } ) );

            // fill settings
            series1.fills.template.setAll( {
                "fillOpacity": 0.3,
                "visible": true,
            } );

            // data processor
            series1.data.processor = am5.DataProcessor.new( root, {
                "dateFields": ["date"],
                "dateFormat": "i",
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
                "text": this.l10nd( "vue-ext", "FS used space (MB) for the last 30 days" ),
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
                "tooltipDateFormat": "I",
                "tooltip": am5.Tooltip.new( root, {} ),
            } ) );

            // y axis
            const yAxis = chart.yAxes.push( am5xy.ValueAxis.new( root, {
                "renderer": am5xy.AxisRendererY.new( root, {} ),
                "tooltip": am5.Tooltip.new( root, {} ),
            } ) );

            // series 1
            const series1 = chart.series.push( am5xy.SmoothedXLineSeries.new( root, {
                "name": this.l10nd( `vue-ext`, "FS used" ),
                xAxis,
                yAxis,
                "valueXField": "date",
                "valueYField": "fs_used",
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": this.l10nd( "vue-ext", "Used" ) + ": {valueY} MB",
                } ),
                "stroke": am5.color( "#00ff00" ),
                "fill": am5.color( "#00ff00" ),
                "connect": true,
            } ) );

            // fill settings
            series1.fills.template.setAll( {
                "fillOpacity": 0.3,
                "visible": true,
            } );

            // data processor
            series1.data.processor = am5.DataProcessor.new( root, {
                "dateFields": ["date"],
                "dateFormat": "i",
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
                this.$refs.memryUsedChart.setData( res.data );
                this.$refs.memryRssChart.setData( res.data );
                this.$refs.fsUsedChart.setData( res.data );
            }
        },

        // XXX
        setDateAxis ( axis ) {

            // dateFormats
            const dateFormats = axis.get( "dateFormats" );
            dateFormats.millisecond = { "minute": "numeric", "second": "numeric", "fractionalSecondDigits": 3 };
            dateFormats.second = { "hour": "numeric", "minute": "numeric", "second": "numeric" };
            dateFormats.minute = { "hour": "numeric", "minute": "numeric" };
            dateFormats.hour = { "hour": "numeric", "minute": "numeric" };
            dateFormats.day = { "month": "short", "day": "numeric" };
            dateFormats.week = { "month": "short", "day": "numeric" };
            dateFormats.month = { "month": "short" };
            dateFormats.year = { "year": "numeric" };

            // periodChangeDateFormats
            const periodChangeDateFormats = axis.get( "periodChangeDateFormats" );
            periodChangeDateFormats.millisecond = { "minute": "numeric", "second": "numeric", "fractionalSecondDigits": 3 };
            periodChangeDateFormats.second = { "hour": "numeric", "minute": "numeric", "second": "numeric" };
            periodChangeDateFormats.minute = { "hour": "numeric", "minute": "numeric" };
            periodChangeDateFormats.hour = { "month": "short", "day": "numeric" };
            periodChangeDateFormats.day = { "month": "short", "day": "numeric" };
            periodChangeDateFormats.week = { "month": "short", "day": "numeric" };
            periodChangeDateFormats.month = { "month": "short", "year": "numeric" };
            periodChangeDateFormats.year = { "year": "numeric" };

            // tooltipDateFormats
            const tooltipDateFormats = axis.get( "tooltipDateFormats" );
            tooltipDateFormats.millisecond = {
                "hour": "numeric",
                "minute": "numeric",
                "second": "numeric",
                "fractionalSecondDigits": 3,
            };
            tooltipDateFormats.second = { "hour": "numeric", "minute": "numeric", "second": "numeric" };
            tooltipDateFormats.minute = {
                "year": "numeric",
                "month": "short",
                "day": "numeric",
                "hour": "numeric",
                "minute": "numeric",
            };
            tooltipDateFormats.hour = {
                "year": "numeric",
                "month": "short",
                "day": "numeric",
                "hour": "numeric",
                "minute": "numeric",
            };
            tooltipDateFormats.day = { "year": "numeric", "month": "short", "day": "numeric" };
            tooltipDateFormats.week = { "year": "numeric", "month": "short", "day": "numeric" };
            tooltipDateFormats.month = { "year": "numeric", "month": "short" };
            tooltipDateFormats.year = { "year": "numeric" };
        },
    },
};
</script>

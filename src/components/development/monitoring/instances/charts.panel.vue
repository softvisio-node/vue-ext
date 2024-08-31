<template>
    <CardsPanel ref="cardsPanel" @refresh="refresh">
        <template #docked>
            <ext-toolbar docked="top">
                <ext-spacer/>
                <slot name="toolbar"/>
                <ext-button iconCls="fa-solid fa-redo" :text="l10n(`Refresh`)" @tap="refresh"/>
            </ext-toolbar>
        </template>

        <template #dataPanel>
            <ext-container defaults='{"height":300}' layput="vbox" scrollable="true">
                <ext-amcharts5 ref="cpuUsageChart" :createChart="_createCpuUsageChart"/>

                <ext-amcharts5 ref="memryUsedChart" :createChart="_createMemoryUsedChart"/>

                <ext-amcharts5 ref="memryRssChart" :createChart="_createMemoryRssChart"/>

                <ext-amcharts5 ref="fsUsedChart" :createChart="_createFsUsedChart"/>
            </ext-container>
        </template>
    </CardsPanel>
</template>

<script>
import "#src/components/amcharts5";
import CardsPanel from "#src/components/cards.panel";
import * as am5xy from "@amcharts/amcharts5/xy";

const PERIODS = {
    "1 hour": "minute",
    "30 days": "hour",
};

export default {
    "components": { CardsPanel },

    "props": {
        "record": {
            "type": Object,
            "default": null,
        },
        "period": {
            "type": String,
            "required": true,
        },
    },

    "watch": {
        record ( newValue, OldValue ) {
            if ( newValue !== OldValue ) this.refresh();
        },
    },

    "methods": {
        async refresh () {
            if ( !this.record ) {
                this.$refs.cardsPanel.showNoDataPanel();

                return;
            }

            this.$refs.cardsPanel.mask();

            const res = await this.$api.call( "development/monitoring/instances/get-instance-stats", this.record.id, this.period );

            this.$refs.cardsPanel.unmask();

            if ( !res.ok ) {
                this.$refs.cardsPanel.setResult( res );
            }
            else if ( !res.data?.length ) {
                this.$refs.cardsPanel.showNoDataPanel();
            }
            else {
                this.$refs.cardsPanel.setResult( res );

                this.$refs.cpuUsageChart.ext.setData( res.data );
                this.$refs.memryUsedChart.ext.setData( res.data );
                this.$refs.memryRssChart.ext.setData( res.data );
                this.$refs.fsUsedChart.ext.setData( res.data );
            }
        },

        _createCpuUsageChart ( cmp ) {
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
                "text": l10n( `CPU usage` ),
                "fontSize": 12,
                "x": am5.percent( 50 ),
                "centerX": am5.percent( 50 ),
            } ) );

            // x axis
            const xAxis = chart.xAxes.push( am5xy.DateAxis.new( root, {
                "maxDeviation": 0,
                "baseInterval": {
                    "timeUnit": PERIODS[ this.period ],
                    "count": 1,
                },
                "renderer": am5xy.AxisRendererX.new( root, {} ),
                "tooltip": am5.Tooltip.new( root, {} ),
            } ) );

            // y axis 1
            const yAxis2 = chart.yAxes.push( am5xy.ValueAxis.new( root, {
                "min": 0,
                "max": 1,
                "renderer": am5xy.AxisRendererY.new( root, {} ),
                "tooltip": am5.Tooltip.new( root, {} ),
                "tooltipNumberFormat": { "style": "percent", "maximumFractionDigits": 0 },
                "numberFormat": { "style": "percent", "maximumFractionDigits": 0 },
            } ) );

            // data processor
            const dateProcessor = am5.DataProcessor.new( root, {
                "dateFields": [ "date" ],
                "dateFormat": "i",
            } );

            // serie 1
            const series1 = chart.series.push( am5xy.StepLineSeries.new( root, {
                "name": l10n( `CPU usage` ),
                xAxis,
                "yAxis": yAxis2,
                "valueXField": "date",
                "valueYField": "cpu_usage",
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": l10n( `CPU usage` ) + ": {valueY.formatNumber()}",
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
                    "numberFormat": { "style": "percent" },
                } )
            );

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
                "text": l10n( `RAM usage` ),
                "fontSize": 12,
                "x": am5.percent( 50 ),
                "centerX": am5.percent( 50 ),
            } ) );

            // x axis
            const xAxis = chart.xAxes.push( am5xy.DateAxis.new( root, {
                "maxDeviation": 0,
                "baseInterval": {
                    "timeUnit": PERIODS[ this.period ],
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
                "dateFields": [ "date" ],
                "dateFormat": "i",
            } );

            // serie 1
            const series1 = chart.series.push( am5xy.StepLineSeries.new( root, {
                "name": l10n( `RAM used (MB)` ),
                xAxis,
                "yAxis": yAxis1,
                "valueXField": "date",
                "valueYField": "ram_used",
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": l10n( `RAM used` ) + ": {valueY.formatNumber()}",
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
                "name": l10n( `RAM used (%)` ),
                xAxis,
                "yAxis": yAxis2,
                "valueXField": "date",
                "valueYField": "ram_used_percent",
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": l10n( `RAM used` ) + ": {valueY.formatNumber()}",
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
                "text": l10n( `RSS usage` ),
                "fontSize": 12,
                "x": am5.percent( 50 ),
                "centerX": am5.percent( 50 ),
            } ) );

            // x axis
            const xAxis = chart.xAxes.push( am5xy.DateAxis.new( root, {
                "maxDeviation": 0,
                "baseInterval": {
                    "timeUnit": PERIODS[ this.period ],
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
                "dateFields": [ "date" ],
                "dateFormat": "i",
            } );

            // serie 1
            const series1 = chart.series.push( am5xy.StepLineSeries.new( root, {
                "name": l10n( `RSS used (MB)` ),
                xAxis,
                "yAxis": yAxis1,
                "valueXField": "date",
                "valueYField": "rss_used",
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": l10n( `RSS used` ) + ": {valueY.formatNumber()}",
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
                "name": l10n( `RSS used (%)` ),
                xAxis,
                "yAxis": yAxis2,
                "valueXField": "date",
                "valueYField": "rss_used_percent",
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": l10n( `RSS used` ) + ": {valueY.formatNumber()}",
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
                "text": l10n( `HDD usage` ),
                "fontSize": 12,
                "x": am5.percent( 50 ),
                "centerX": am5.percent( 50 ),
            } ) );

            // x axis
            const xAxis = chart.xAxes.push( am5xy.DateAxis.new( root, {
                "maxDeviation": 0,
                "baseInterval": {
                    "timeUnit": PERIODS[ this.period ],
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
                "dateFields": [ "date" ],
                "dateFormat": "i",
            } );

            // serie 1
            const series1 = chart.series.push( am5xy.SmoothedXLineSeries.new( root, {
                "name": l10n( `HDD used (MB)` ),
                xAxis,
                "yAxis": yAxis1,
                "valueXField": "date",
                "valueYField": "hdd_used",
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": l10n( `HDD used` ) + ": {valueY.formatNumber()}",
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
                "name": l10n( `HDD used (%)` ),
                xAxis,
                "yAxis": yAxis2,
                "valueXField": "date",
                "valueYField": "hdd_used_percent",
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": l10n( `HDD used` ) + ": {valueY.formatNumber()}",
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
    },
};
</script>

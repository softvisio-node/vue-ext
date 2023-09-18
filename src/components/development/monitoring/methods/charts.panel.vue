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
                <AmchartsPanel ref="callsChart" :createChart="_createCallsChart"/>

                <AmchartsPanel ref="durationChart" :createChart="_createDurationChart"/>

                <AmchartsPanel ref="exceptionsChart" :createChart="_createExceptionsChart"/>
            </ext-container>
        </template>
    </CardsPanel>
</template>

<script>
import CardsPanel from "#src/components/cards.panel";
import AmchartsPanel from "#vue/components/amcharts5/panel";
import * as am5xy from "@amcharts/amcharts5/xy";

const PERIODS = {
    "1 hour": "minute",
    "30 days": "hour",
};

export default {
    "components": { CardsPanel, AmchartsPanel },

    "props": {
        "record": {
            "type": Object,
            "required": true,
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

            const res = await this.$api.call( "development/monitoring/methods/get-monitoring-method-stats", this.record.id, this.period );

            this.$refs.cardsPanel.unmask();

            if ( !res.ok ) {
                this.$refs.cardsPanel.setResult( res );
            }
            else if ( !res.data?.length ) {
                this.$refs.cardsPanel.showNoDataPanel();
            }
            else {
                this.$refs.cardsPanel.setResult( res );

                this.$refs.callsChart.setData( res.data );
                this.$refs.durationChart.setData( res.data );
                this.$refs.exceptionsChart.setData( res.data );
            }
        },

        _createCallsChart ( cmp ) {
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
                "text": this.l10n( `Calls` ),
                "fontSize": 12,
                "x": am5.percent( 50 ),
                "centerX": am5.percent( 50 ),
            } ) );

            // x axis
            const xAxis = chart.xAxes.push( am5xy.DateAxis.new( root, {
                "maxDeviation": 0,
                "baseInterval": {
                    "timeUnit": PERIODS[this.period],
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
                "name": this.l10n( `Calls` ),
                xAxis,
                "yAxis": yAxis1,
                "valueXField": "date",
                "valueYField": "calls",
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": this.l10n( `Calls` ) + ": {valueY}",
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

        _createDurationChart ( cmp ) {
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
                "text": this.l10n( `Duration per call (ms)` ),
                "fontSize": 12,
                "x": am5.percent( 50 ),
                "centerX": am5.percent( 50 ),
            } ) );

            // x axis
            const xAxis = chart.xAxes.push( am5xy.DateAxis.new( root, {
                "maxDeviation": 0,
                "baseInterval": {
                    "timeUnit": PERIODS[this.period],
                    "count": 1,
                },
                "renderer": am5xy.AxisRendererX.new( root, {} ),
                "tooltip": am5.Tooltip.new( root, {} ),
            } ) );

            // y axis 1
            const yAxis1 = chart.yAxes.push( am5xy.ValueAxis.new( root, {
                "renderer": am5xy.AxisRendererY.new( root, {} ),
                "tooltip": am5.Tooltip.new( root, {} ),
                "tooltipNumberFormat": { "style": "unit", "unit": "millisecond" },
                "numberFormat": { "style": "unit", "unit": "millisecond" },
            } ) );

            // data processor
            const dateProcessor = am5.DataProcessor.new( root, {
                "dateFields": ["date"],
                "dateFormat": "i",
            } );

            // serie 1
            const series1 = chart.series.push( am5xy.StepLineSeries.new( root, {
                "name": this.l10n( `Duration (ms)` ),
                xAxis,
                "yAxis": yAxis1,
                "valueXField": "date",
                "valueYField": "duration_per_call",
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": this.l10n( `Duration` ) + ": {valueY.formatNumber()}",
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
                    "numberFormat": { "style": "unit", "unit": "millisecond" },
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

        _createExceptionsChart ( cmp ) {
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
                "text": this.l10n( `Exceptions (%)` ),
                "fontSize": 12,
                "x": am5.percent( 50 ),
                "centerX": am5.percent( 50 ),
            } ) );

            // x axis
            const xAxis = chart.xAxes.push( am5xy.DateAxis.new( root, {
                "maxDeviation": 0,
                "baseInterval": {
                    "timeUnit": PERIODS[this.period],
                    "count": 1,
                },
                "renderer": am5xy.AxisRendererX.new( root, {} ),
                "tooltip": am5.Tooltip.new( root, {} ),
            } ) );

            // y axis 1
            const yAxis1 = chart.yAxes.push( am5xy.ValueAxis.new( root, {
                "min": 0,
                "max": 1,
                "renderer": am5xy.AxisRendererY.new( root, {} ),
                "tooltip": am5.Tooltip.new( root, {} ),
                "tooltipNumberFormat": { "style": "percent" },
                "numberFormat": { "style": "percent" },
            } ) );

            // data processor
            const dateProcessor = am5.DataProcessor.new( root, {
                "dateFields": ["date"],
                "dateFormat": "i",
            } );

            // serie 1
            const series1 = chart.series.push( am5xy.StepLineSeries.new( root, {
                "name": this.l10n( `Exceptions (%)` ),
                xAxis,
                "yAxis": yAxis1,
                "valueXField": "date",
                "valueYField": "exceptions_percent",
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": this.l10n( `Exceptions` ) + ": {valueY}",
                } ),
                "stroke": am5.color( "#ff0000" ),
                "fill": am5.color( "#ff0000" ),
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
    },
};
</script>

<template>
    <CardsPanel ref="cardsPanel" scrollable="true" @refresh="refresh">
        <template #docked>
            <ext-toolbar docked="top">
                <ext-container :html="title"/>
                <ext-spacer/>
                <ext-button iconCls="fa-solid fa-redo" :text="l10nd(`vue-ext`, `Refresh`)" @tap="refresh"/>
            </ext-toolbar>
        </template>

        <template #data>
            <ext-container layput="vbox" scrollable="true">
                <AmchartsPanel ref="callsChart" :createChart="_createCallsChart" height="150"/>
                <AmchartsPanel ref="durationChart" :createChart="_createDurationChart" height="150"/>
                <AmchartsPanel ref="exceptionsChart" :createChart="_createExceptionsChart" height="150"/>
            </ext-container>
        </template>
    </CardsPanel>
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
            return this.l10nd( "vue-ext", msgid`Method: ${this.record?.get( "method_name" ) || "-"}` );
        },
    },

    "watch": {
        record ( newValue, OldValue ) {
            if ( newValue !== OldValue ) this.refresh();
        },
    },

    "methods": {
        _createCallsChart ( cmp ) {
            const root = cmp.root,
                am5 = cmp.am5;

            // chart
            const chart = root.container.children.push( am5xy.XYChart.new( root, {
                "layout": root.verticalLayout,

                // "panX": true,
                // "pinchZoomX": true,
                // "wheelX": "panX",
                // "wheelY": "none",
            } ) );

            // title
            chart.children.unshift( am5.Label.new( root, {
                "text": this.l10nd( "vue-ext", "Calls for the last 60 minutes" ),
                "fontSize": 12,
                "x": am5.percent( 50 ),
                "centerX": am5.percent( 50 ),
            } ) );

            // x axis
            const xAxis = chart.xAxes.push( am5xy.DateAxis.new( root, {
                "baseInterval": {
                    "timeUnit": "minute",
                    "count": 1,
                },
                "renderer": am5xy.AxisRendererX.new( root, {} ),
                "tooltipDateFormat": "HH:mm",
                "tooltip": am5.Tooltip.new( root, {} ),
            } ) );

            // y axis
            const yAxis = chart.yAxes.push( am5xy.ValueAxis.new( root, {
                "renderer": am5xy.AxisRendererY.new( root, {} ),
                "tooltip": am5.Tooltip.new( root, {} ),
            } ) );

            // serie 1
            const series1 = chart.series.push( am5xy.StepLineSeries.new( root, {
                "name": this.l10nd( `vue-ext`, "Calls" ),
                xAxis,
                yAxis,
                "valueXField": "date",
                "valueYField": "calls",
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": this.l10nd( "vue-ext", "Calls" ) + ": {valueY}",
                } ),
                "stroke": am5.color( "#00ff00" ),
                "fill": am5.color( "#00ff00" ),
            } ) );

            // fill settings
            series1.fills.template.setAll( {
                "fillOpacity": 0.5,
                "visible": true,
            } );

            // date processor
            series1.data.processor = am5.DataProcessor.new( root, {
                "dateFields": ["date"],
                "dateFormat": "i",
            } );

            // cursor
            chart.set(
                "cursor",
                am5xy.XYCursor.new( root, {
                    "behavior": "none", // "zoomX",
                } )
            );
        },

        _createDurationChart ( cmp ) {
            const root = cmp.root,
                am5 = cmp.am5;

            // chart
            const chart = root.container.children.push( am5xy.XYChart.new( root, {
                "layout": root.verticalLayout,

                // "panX": true,
                // "pinchZoomX": true,
                // "wheelX": "panX",
                // "wheelY": "none",
            } ) );

            // title
            chart.children.push( am5.Label.new( root, {
                "text": this.l10nd( "vue-ext", "Average duration per call for the last 60 minutes (ms)" ),
                "fontSize": 12,
                "x": am5.percent( 50 ),
                "centerX": am5.percent( 50 ),
            } ) );

            // x axis
            const xAxis = chart.xAxes.push( am5xy.DateAxis.new( root, {
                "baseInterval": {
                    "timeUnit": "minute",
                    "count": 1,
                },
                "renderer": am5xy.AxisRendererX.new( root, {} ),
                "tooltipDateFormat": "HH:mm",
                "tooltip": am5.Tooltip.new( root, {} ),
            } ) );

            // y axis
            const yAxis = chart.yAxes.push( am5xy.ValueAxis.new( root, {
                "renderer": am5xy.AxisRendererY.new( root, {} ),
                "tooltip": am5.Tooltip.new( root, {} ),
            } ) );

            // serie 1
            const series1 = chart.series.push( am5xy.StepLineSeries.new( root, {
                "name": this.l10nd( `vue-ext`, "Runtime" ),
                xAxis,
                yAxis,
                "valueXField": "date",
                "valueYField": "duration_per_call",
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": this.l10nd( "vue-ext", "Duration" ) + ": {valueY} ms",
                } ),
                "stroke": am5.color( "#00ff00" ),
                "fill": am5.color( "#00ff00" ),
            } ) );

            // fill settings
            series1.fills.template.setAll( {
                "fillOpacity": 0.5,
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
                    "behavior": "none", // "zoomX",
                } )
            );
        },

        _createExceptionsChart ( cmp ) {
            const root = cmp.root,
                am5 = cmp.am5;

            // chart
            const chart = root.container.children.push( am5xy.XYChart.new( root, {
                "layout": root.verticalLayout,

                // "panX": true,
                // "pinchZoomX": true,
                // "wheelX": "panX",
                // "wheelY": "none",
            } ) );

            // title
            chart.children.push( am5.Label.new( root, {
                "text": this.l10nd( "vue-ext", "Exceptions percent for the last 60 minutes (%)" ),
                "fontSize": 12,
                "x": am5.percent( 50 ),
                "centerX": am5.percent( 50 ),
            } ) );

            // x axis
            const xAxis = chart.xAxes.push( am5xy.DateAxis.new( root, {
                "baseInterval": {
                    "timeUnit": "minute",
                    "count": 1,
                },
                "renderer": am5xy.AxisRendererX.new( root, {} ),
                "tooltipDateFormat": "HH:mm",
                "tooltip": am5.Tooltip.new( root, {} ),
            } ) );

            // y axis
            const yAxis = chart.yAxes.push( am5xy.ValueAxis.new( root, {
                "renderer": am5xy.AxisRendererY.new( root, {} ),
                "tooltip": am5.Tooltip.new( root, {} ),
            } ) );

            // series 1
            const series1 = chart.series.push( am5xy.StepLineSeries.new( root, {
                "name": this.l10nd( `vue-ext`, "Exceptions (%)" ),
                xAxis,
                yAxis,
                "valueYField": "exceptions_percent",
                "valueXField": "date",
                "stacked": true,
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": this.l10nd( "vue-ext", "Exceptions" ) + ": {valueY}%",
                } ),
                "stroke": am5.color( "#ff0000" ),
                "fill": am5.color( "#ff0000" ),
            } ) );

            // fill settings
            series1.fills.template.setAll( {
                "fillOpacity": 0.5,
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
                    "behavior": "none", // "zoomX",
                } )
            );
        },

        async refresh () {
            if ( !this.record ) {
                this.$refs.cardsPanel.showNoDataCard();

                return;
            }

            this.$refs.cardsPanel.mask();

            const res = await this.$api.call( "development/monitoring/methods/get-latest-time-series", this.record.id );

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

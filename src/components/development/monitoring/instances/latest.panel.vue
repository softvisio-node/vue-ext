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
                <AmchartsPanel ref="cpuUserChart" :createChart="_createCpuUserChart" height="150"/>

                <AmchartsPanel ref="cpuSystemChart" :createChart="_createCpuSystemChart" height="150"/>

                <AmchartsPanel ref="memryFreeChart" :createChart="_createMemryFreeChart" height="150"/>

                <AmchartsPanel ref="memryRssChart" :createChart="_createMemryRssChart" height="150"/>

                <AmchartsPanel ref="fsFreeChart" :createChart="_createFsFreeChart" height="150"/>
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
        _createCpuUserChart ( cmp ) {
            const root = cmp.root,
                am5 = cmp.am5;

            // chart
            const chart = root.container.children.push( am5xy.XYChart.new( root, {

                // "layout": root.verticalLayout,
                // "panX": true,
                // "wheelX": "panX",
                // "pinchZoomX": true,
                // "panY": true,
                // "wheelY": "zoomX",
            } ) );

            // title
            chart.children.push( am5.Label.new( root, {
                "text": this.l10nd( "vue-ext", "CPU (user) for the last 60 minutes" ),
                "fontSize": 12,
                "x": am5.percent( 50 ),
                "centerX": am5.percent( 50 ),
            } ) );

            // x azis
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

        _createCpuSystemChart ( cmp ) {
            const root = cmp.root,
                am5 = cmp.am5;

            // chart
            const chart = root.container.children.push( am5xy.XYChart.new( root, {

                // "layout": root.verticalLayout,
                // "panX": true,
                // "wheelX": "panX",
                // "pinchZoomX": true,
                // "panY": true,
                // "wheelY": "zoomX",
            } ) );

            // title
            chart.children.push( am5.Label.new( root, {
                "text": this.l10nd( "vue-ext", "CPU (system) for the last 60 minutes" ),
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

        _createMemryFreeChart ( cmp ) {
            const root = cmp.root,
                am5 = cmp.am5;

            // chart
            const chart = root.container.children.push( am5xy.XYChart.new( root, {

                // "layout": root.verticalLayout,
                // "panX": true,
                // "wheelX": "panX",
                // "pinchZoomX": true,
                // "panY": true,
                // "wheelY": "zoomX",
            } ) );

            // title
            chart.children.push( am5.Label.new( root, {
                "text": this.l10nd( "vue-ext", "Free memory (MB) for the last 60 minutes" ),
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
                "name": this.l10nd( `vue-ext`, "Free memory" ),
                xAxis,
                yAxis,
                "valueXField": "date",
                "valueYField": "memory_free",
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": this.l10nd( "vue-ext", "Free memory" ) + ": {valueY} MB",
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

        _createMemryRssChart ( cmp ) {
            const root = cmp.root,
                am5 = cmp.am5;

            // chart
            const chart = root.container.children.push( am5xy.XYChart.new( root, {

                // "layout": root.verticalLayout,
                // "panX": true,
                // "wheelX": "panX",
                // "pinchZoomX": true,
                // "panY": true,
                // "wheelY": "zoomX",
            } ) );

            // title
            chart.children.push( am5.Label.new( root, {
                "text": this.l10nd( "vue-ext", "RSS memory (MB) for the last 60 minutes" ),
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
                "name": this.l10nd( `vue-ext`, "RSS memry" ),
                xAxis,
                yAxis,
                "valueXField": "date",
                "valueYField": "memory_rss",
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": this.l10nd( "vue-ext", "RSS memory" ) + ": {valueY} MB",
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

        _createFsFreeChart ( cmp ) {
            const root = cmp.root,
                am5 = cmp.am5;

            // chart
            const chart = root.container.children.push( am5xy.XYChart.new( root, {

                // "layout": root.verticalLayout,
                // "panX": true,
                // "wheelX": "panX",
                // "pinchZoomX": true,
                // "panY": true,
                // "wheelY": "zoomX",
            } ) );

            // title
            chart.children.push( am5.Label.new( root, {
                "text": this.l10nd( "vue-ext", "FS free space (MB) for the last 60 minutes" ),
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
                "name": this.l10nd( `vue-ext`, "FS free" ),
                xAxis,
                yAxis,
                "valueXField": "date",
                "valueYField": "fs_free",
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": this.l10nd( "vue-ext", "Free" ) + ": {valueY} MB",
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

        async refresh () {
            if ( !this.record ) {
                this.$refs.cardsPanel.showNoDataCard();

                return;
            }

            this.$refs.cardsPanel.mask();

            const res = await this.$api.call( "development/monitoring/instances/get-latest-time-series", this.record.id );

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

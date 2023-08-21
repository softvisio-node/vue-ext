<template>
    <CardsPanel ref="cardsPanel" @refresh="refresh">
        <template #data>
            <ext-panel ref="dataPanel" layout="vbox">
                <ext-toolbar docked="top">
                    <ext-spacer/>
                    <ext-button iconCls="fa-solid fa-redo" :text="l10nd(`vue-ext`, `Refresh`)" @tap="refresh"/>
                </ext-toolbar>

                <Amcharts5 ref="totalUsersChart" :createChart="_createTotalUsersChart" height="200" :updateChart="_updateChart" @refresh="_chartRefresh"/>

                <Amcharts5 ref="totalSubscribedUsersChart" :createChart="_createTotalSubscribedUsersChart" height="200" :updateChart="_updateChart" @refresh="_chartRefresh"/>

                <Amcharts5 ref="subscriptionsChart" :createChart="_createSubscriptionsChart" height="200" :updateChart="_updateChart" @refresh="_chartRefresh"/>
            </ext-panel>
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
        "telegramBotId": {
            "type": String,
            "required": true,
        },
    },

    "methods": {

        // public
        async refresh () {
            this.$refs.cardsPanel.mask();

            const res = await this.$api.call( "administration/telegram-bots/get-bot-stats", this.telegramBotId, "1 year" );

            if ( !res.ok ) {
                this.$refs.cardsPanel.setResult( res );
            }
            else if ( !res.data?.length ) {
                this.$refs.cardsPanel.showNoDataCard();
            }
            else {
                this.$refs.cardsPanel.setResult( res );

                this.$refs.totalUsersChart.setData( res.data );
                this.$refs.totalSubscribedUsersChart.setData( res.data );
                this.$refs.subscriptionsChart.setData( res.data );
            }
        },

        // protected
        _createTotalUsersChart ( cmp ) {
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

            chart.children.push( am5.Label.new( root, {
                "text": this.l10nd( "vue-ext", "Total users" ),
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

            const series1 = chart.series.push( am5xy.LineSeries.new( root, {
                "name": "totalUsers",
                "xAxis": xAxis,
                "yAxis": yAxis,
                "valueXField": "date",
                "valueYField": "total_users",
                "fill": "green",
                "stroke": "green",
                "stacked": true,
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": this.l10nd( "vue-ext", "total users" ) + ": {valueY}",
                } ),
            } ) );

            series1.fills.template.setAll( {
                "fillOpacity": 0.2,
                "visible": true,
            } );

            series1.strokes.template.setAll( {
                "strokeWidth": 2,
            } );

            series1.data.processor = am5.DataProcessor.new( root, {
                "dateFields": ["date"],
                "dateFormat": "i",
            } );
        },

        _createTotalSubscribedUsersChart ( cmp ) {
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

            chart.children.push( am5.Label.new( root, {
                "text": this.l10nd( "vue-ext", "Total subscribed users" ),
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

                // "logarithmic": true, // XXX
                "renderer": am5xy.AxisRendererY.new( root, {} ),
            } ) );

            const series1 = chart.series.push( am5xy.LineSeries.new( root, {
                "name": "totalSubscribedUsers",
                "xAxis": xAxis,
                "yAxis": yAxis,
                "valueXField": "date",
                "valueYField": "total_subscribed_users",
                "connect": false,
                "stroke": "green",

                // "fill": "green",
                // "stacked": true,
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": this.l10nd( "vue-ext", "total subscribed users" ) + ": {valueY}",
                } ),
            } ) );

            series1.fills.template.setAll( {
                "fillOpacity": 0.1,
                "visible": true,
            } );

            series1.strokes.template.setAll( {
                "strokeWidth": 2,
            } );

            series1.data.processor = am5.DataProcessor.new( root, {
                "dateFields": ["date"],
                "dateFormat": "i",
            } );

            series1.data.processor = am5.DataProcessor.new( root, {
                "dateFields": ["date"],
                "dateFormat": "i",
            } );
        },

        _createSubscriptionsChart ( cmp ) {
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

            chart.children.push( am5.Label.new( root, {
                "text": this.l10nd( "vue-ext", "Total subscribed users" ),
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

                // "logarithmic": true, // XXX
                "renderer": am5xy.AxisRendererY.new( root, {} ),
            } ) );

            const series1 = chart.series.push( am5xy.LineSeries.new( root, {
                "name": "totalSubscribedUsers",
                "xAxis": xAxis,
                "yAxis": yAxis,
                "valueXField": "date",
                "valueYField": "total_subscribed_users",
                "connect": false,
                "stroke": "green",

                // "fill": "green",
                // "stacked": true,
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": this.l10nd( "vue-ext", "total subscribed users" ) + ": {valueY}",
                } ),
            } ) );

            series1.fills.template.setAll( {
                "fillOpacity": 0.1,
                "visible": true,
            } );

            series1.strokes.template.setAll( {
                "strokeWidth": 2,
            } );

            series1.data.processor = am5.DataProcessor.new( root, {
                "dateFields": ["date"],
                "dateFormat": "i",
            } );

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
            if ( this.$refs.totalUsersChart.hasData ) return;
            if ( this.$refs.totalSubscribedUsersChart.hasData ) return;
            if ( this.$refs.subscriptionsChart.hasData ) return;

            this.refresh();
        },
    },
};
</script>

<template>
    <CardsPanel ref="cardsPanel" @refresh="refresh">
        <template #data>
            <ext-panel ref="dataPanel" layout="vbox" scrollable="true">
                <ext-toolbar docked="top">
                    <ext-spacer/>
                    <ext-button iconCls="fa-solid fa-redo" :text="l10nd(`vue-ext`, `Refresh`)" @tap="refresh"/>
                </ext-toolbar>

                <AmchartsPanel ref="totalSubscribedUsersChart" :createChart="_createTotalSubscribedUsersChart" height="300"/>

                <AmchartsPanel ref="subscriptionsChart" :createChart="_createSubscriptionsChart" height="300"/>
            </ext-panel>
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

                this.$refs.totalSubscribedUsersChart.setData( res.data );
                this.$refs.subscriptionsChart.setData( res.data );
            }
        },

        // protected
        // XXX timeunnit
        _createTotalSubscribedUsersChart ( cmp ) {
            const root = cmp.root,
                am5 = cmp.am5;

            // chart
            const chart = root.container.children.push( am5xy.XYChart.new( root, {
                "layout": root.verticalLayout,
                "panX": true,

                // "wheelX": "panX",
                "pinchZoomX": true,

                // "panY": true,
                // "wheelY": "zoomX",
            } ) );

            // title
            chart.children.unshift( am5.Label.new( root, {
                "text": this.l10nd( "vue-ext", "Total subscribed users" ),
                "fontSize": 12,
                "x": am5.percent( 50 ),
                "centerX": am5.percent( 50 ),
            } ) );

            // x axis
            const xAxis = chart.xAxes.push( am5xy.DateAxis.new( root, {
                "baseInterval": {
                    "timeUnit": "day", // XXX
                    "count": 1,
                },
                "renderer": am5xy.AxisRendererX.new( root, {} ),
                "tooltipDateFormat": "HH:mm",
                "tooltip": am5.Tooltip.new( root, {} ),
            } ) );

            // y axis
            const yAxis = chart.yAxes.push( am5xy.ValueAxis.new( root, {
                "renderer": am5xy.AxisRendererY.new( root, {} ),
            } ) );

            // series 1
            const series1 = chart.series.push( am5xy.StepLineSeries.new( root, {
                "name": "Total subscribed users",
                xAxis,
                yAxis,
                "valueXField": "date",
                "valueYField": "total_subscribed_users",
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": this.l10nd( "vue-ext", "Subscribed users" ) + ": {valueY}",
                } ),
                "stroke": am5.color( "#00ff00" ),
                "fill": am5.color( "#00ff00" ),
                "connect": true,
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

            // eries 2
            const series2 = chart.series.push( am5xy.SmoothedXLineSeries.new( root, {
                "name": "Total unsubscribed users",
                xAxis,
                yAxis,
                "valueXField": "date",
                "valueYField": "total_unsubscribed_users",
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": this.l10nd( "vue-ext", "Unsubscribed users" ) + ": {valueY}",
                } ),
                "stroke": am5.color( "#ff0000" ),
                "fill": am5.color( "#ff0000" ),
                "connect": true,
            } ) );

            // fill settings
            series2.fills.template.setAll( {
                "fillOpacity": 0.5,
                "visible": true,
            } );

            // date processor
            series2.data.processor = am5.DataProcessor.new( root, {
                "dateFields": ["date"],
                "dateFormat": "i",
            } );

            // scroll bar
            chart.set(
                "scrollbarX",
                am5.Scrollbar.new( root, {
                    "orientation": "horizontal",
                } )
            );

            // cursor
            chart.set(
                "cursor",
                am5xy.XYCursor.new( root, {
                    "behavior": "zoomX",
                } )
            );

            // legend
            const legend = chart.children.push( am5.Legend.new( root, {
                "centerX": am5.p50,
                "x": am5.p50,
            } ) );

            legend.data.setAll( chart.series.values );
        },

        // XXX timeunnit
        _createSubscriptionsChart ( cmp ) {
            const root = cmp.root,
                am5 = cmp.am5;

            // chart
            const chart = root.container.children.push( am5xy.XYChart.new( root, {
                "layout": root.verticalLayout,
                "panX": true,

                // "wheelX": "panX",
                "pinchZoomX": true,

                // "panY": true,
                // "wheelY": "zoomX",
            } ) );

            // title
            chart.children.unshift( am5.Label.new( root, {
                "text": this.l10nd( "vue-ext", "Subscribed users" ),
                "fontSize": 12,
                "x": am5.percent( 50 ),
                "centerX": am5.percent( 50 ),
            } ) );

            // x axis
            const xAxis = chart.xAxes.push( am5xy.DateAxis.new( root, {
                "baseInterval": {
                    "timeUnit": "day", // XXX
                    "count": 1,
                },
                "renderer": am5xy.AxisRendererX.new( root, {} ),
                "tooltipDateFormat": "HH:mm",
                "tooltip": am5.Tooltip.new( root, {} ),
            } ) );

            // y axis
            const yAxis = chart.yAxes.push( am5xy.ValueAxis.new( root, {
                "renderer": am5xy.AxisRendererY.new( root, {} ),
            } ) );

            // series 1
            const series1 = chart.series.push( am5xy.ColumnSeries.new( root, {
                "name": "Subscribed usersDelta",
                xAxis,
                yAxis,
                "valueXField": "date",
                "valueYField": "total_subscribed_users_delta",
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": this.l10nd( "vue-ext", "Subscribed" ) + ": {valueY}",
                } ),
                "stroke": am5.color( "#00ff00" ),
                "fill": am5.color( "#00ff00" ),
            } ) );

            // date processor
            series1.data.processor = am5.DataProcessor.new( root, {
                "dateFields": ["date"],
                "dateFormat": "i",
            } );

            // series 2
            const series2 = chart.series.push( am5xy.ColumnSeries.new( root, {
                "name": "Unsubscribed usersDelta",
                "xAxis": xAxis,
                "yAxis": yAxis,
                "valueXField": "date",
                "valueYField": "total_unsubscribed_users_delta",
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": this.l10nd( "vue-ext", "Unsubscribed" ) + ": {valueY}",
                } ),
                "stroke": am5.color( "#ff0000" ),
                "fill": am5.color( "#ff0000" ),
            } ) );

            // date processor
            series2.data.processor = am5.DataProcessor.new( root, {
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

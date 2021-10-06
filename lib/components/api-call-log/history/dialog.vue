<template>
    <ext-dialog :title="title" width="95%" height="95%" scrollable="true" closable="true" draggable="false" closeAction="hide" hideOnMaskTap="true" layout="vbox" viewModel="true" @ready="ready">
        <ext-toolbar docked="top">
            <ext-spacer/>
            <ext-button iconCls="fas fa-redo" text="Refresh" @tap="refresh"/>
        </ext-toolbar>

        <AmchartsPanel height="400" @ready="loadChartReady"/>

        <AmchartsPanel height="300" @ready="runtimeChartReady"/>

        <AmchartsPanel height="300" @ready="exceptionsChartReady"/>
    </ext-dialog>
</template>

<script>
import AmchartsPanel from "#vue/components/am4charts/panel";

export default {
    "components": { AmchartsPanel },

    data () {
        return { "title": "History" };
    },

    "methods": {
        async ready ( e ) {
            this.ext = e.detail.cmp;
        },

        setRecord ( record ) {
            this.record = record;

            this.title = `History for Method "${record.id}"`;

            this.refresh();
        },

        loadChartReady ( chart ) {
            this.loadChart = chart;

            chart.create( {
                "titles": [{ "text": "Acceptes / Declined Requests for Last 30 Days", "fontSize": 12 }],
                "type": "XYChart",

                "dateFormatter": { "inputDateFormat": "yyyy-MM-dd HH:mm:ss" },

                "cursor": { "type": "XYCursor", "behavior": "zoomX" },

                "scrollbarX": {
                    "type": "XYChartScrollbar",
                    "series": ["accepted", "declined"],
                },

                "legend": {},

                "xAxes": [
                    {
                        "type": "DateAxis",

                        // grouping
                        "groupData": true,
                        "groupCount": 24 * 30,

                        // pre-zoom
                        "start": 0.75,
                        "end": 1,
                        "keepSelection": true,
                    },
                ],
                "yAxes": [
                    {
                        "id": "value",
                        "type": "ValueAxis",
                        "title": { "text": "Requests" },
                        "min": 0,
                    },
                ],

                "series": [
                    {
                        "id": "accepted",
                        "type": "ColumnSeries",
                        "name": "Accepted",
                        "yAxis": "value",
                        "dataFields": {
                            "dateX": "date",
                            "valueY": "total_accepted",
                        },
                        "groupFields": { "valueY": "sum" },
                        "tooltipText": "Accepted requests: {valueY.value}",
                        "stacked": true,
                        "fill": "green",
                        "stroke": "green",
                        "columns": {
                            "maxWidth": 30,
                        },
                    },
                    {
                        "id": "declined",
                        "type": "ColumnSeries",
                        "name": "Declined",
                        "yAxis": "value",
                        "dataFields": {
                            "dateX": "date",
                            "valueY": "total_declined",
                        },
                        "groupFields": { "valueY": "sum" },
                        "tooltipText": "Declined requests: {valueY.value}",
                        "stacked": true,
                        "fill": "red",
                        "stroke": "red",
                        "columns": {
                            "maxWidth": 30,
                        },
                    },
                ],
            } );

            this.refresh();
        },

        runtimeChartReady ( chart ) {
            this.runtimeChart = chart;

            chart.create( {
                "titles": [{ "text": "Average Runtime for Last 30 Days", "fontSize": 12 }],
                "type": "XYChart",

                "dateFormatter": { "inputDateFormat": "yyyy-MM-dd HH:mm:ss" },

                "cursor": { "type": "XYCursor", "behavior": "zoomX" },

                "scrollbarX": {
                    "type": "XYChartScrollbar",
                    "series": ["runtime"],
                },

                "xAxes": [
                    {
                        "type": "DateAxis",

                        // grouping
                        "groupData": true,
                        "groupCount": 24 * 30,

                        // pre-zoom
                        "start": 0.75,
                        "end": 1,
                        "keepSelection": true,
                    },
                ],
                "yAxes": [
                    {
                        "id": "value",
                        "type": "ValueAxis",
                        "title": { "text": "Seconds" },
                        "min": 0,
                        "numberFormatter": { "type": "NumberFormatter", "numberFormat": "#.##" },
                    },
                ],

                "series": [
                    {
                        "id": "runtime",
                        "type": "ColumnSeries",
                        "name": "Runtime",
                        "yAxis": "value",
                        "dataFields": {
                            "dateX": "date",
                            "valueY": "avg_runtime",
                        },
                        "groupFields": { "valueY": "average" },
                        "tooltipText": "Average runtime: {valueY.value} sec.",
                        "stacked": true,
                        "fill": "green",
                        "stroke": "green",
                        "columns": {
                            "maxWidth": 30,
                        },
                    },
                ],
            } );

            this.refresh();
        },

        exceptionsChartReady ( chart ) {
            this.exceptionsChart = chart;

            chart.create( {
                "titles": [{ "text": "Exceptions Percent for Last 30 Days", "fontSize": 12 }],
                "type": "XYChart",

                "dateFormatter": { "inputDateFormat": "yyyy-MM-dd HH:mm:ss" },

                "cursor": { "type": "XYCursor", "behavior": "zoomX" },

                "scrollbarX": {
                    "type": "XYChartScrollbar",
                    "series": ["exceptions"],
                },

                "xAxes": [
                    {
                        "type": "DateAxis",

                        // grouping
                        "groupData": true,
                        "groupCount": 24 * 30,

                        // pre-zoom
                        "start": 0.75,
                        "end": 1,
                        "keepSelection": true,
                    },
                ],
                "yAxes": [
                    {
                        "id": "value",
                        "type": "ValueAxis",
                        "title": { "text": "Exceptions (%)" },
                        "min": 0,
                        "max": 100,
                        "strictMinMax": true,
                        "numberFormatter": { "type": "NumberFormatter", "numberFormat": "#.##" },
                    },
                ],

                "series": [
                    {
                        "id": "exceptions",
                        "type": "ColumnSeries",
                        "name": "Exceptions",
                        "yAxis": "value",
                        "dataFields": {
                            "dateX": "date",
                            "valueY": "exceptions_percent",
                        },
                        "groupFields": { "valueY": "average" },
                        "tooltipText": "Exceptions: {valueY.value}%",
                        "stacked": true,
                        "fill": "red",
                        "stroke": "red",
                        "columns": {
                            "maxWidth": 30,
                        },
                    },
                ],
            } );

            this.refresh();
        },

        async refresh () {
            if ( !this.record || !this.loadChart || !this.runtimeChart || !this.exceptionsChart ) return;

            this.ext.mask();

            const res = await this.$api.call( "admin/api-call-log/read-history-stat", this.record.id );

            this.ext.unmask();

            if ( !res.ok ) {
                this.$utils.toast( res );

                this.ext.hide();
            }

            this.loadChart.setData( res.data.load );
            this.runtimeChart.setData( res.data.requests );
            this.exceptionsChart.setData( res.data.requests );
        },
    },
};
</script>

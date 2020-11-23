<template>
    <ext-dialog title="Dashboard" width="1000" height="600" displayed="true" scrollable="true" closable="true" draggable="false" closeAction="hide" hideOnMaskTap="true" layout="vbox" viewModel="true" @ready="ready">
        <ext-toolbar docked="top">
            <ext-spacer/>
            <ext-button iconCls="fas fa-redo" text="Refresh" @tap="refresh"/>
        </ext-toolbar>

        <ext-container layout="vbox" height="100">
            <ext-progress ref="running-threads" text="Running Threads" height="20"/>
            <ext-spacer height="5"/>
            <ext-progress ref="queue-length" text="Queue Length" height="20"/>
            <ext-spacer flex="1"/>
        </ext-container>

        <AmchartsPanel height="400" @ready="trafficChartReady"/>

        <AmchartsPanel height="300" @ready="errorsChartReady"/>
    </ext-dialog>
</template>

<script>
import AmchartsPanel from "#softvisio/components/am4charts/panel";

export default {
    "components": { AmchartsPanel },

    "methods": {
        async ready ( e ) {
            this.$ext = e.detail.cmp;
        },

        setRecord ( record ) {
            this.record = record;

            this.refresh();
        },

        trafficChartReady ( chart ) {
            this.trafficChart = chart;

            chart.create( {
                "titles": [{ "text": "Traffic for Last 30 Days", "fontSize": 12 }],
                "type": "XYChart",

                "dateFormatter": {
                    "inputDateFormat": "yyyy-MM-dd HH:mm:ss",
                },

                // "responsive": { "enabled": true },
                "cursor": { "type": "XYCursor", "behavior": "zoomX" },

                "scrollbarX": {
                    "type": "XYChartScrollbar",
                    "series": ["traffic_successful", "traffic_errors"],
                },

                "legend": {},

                "xAxes": [
                    {
                        "type": "DateAxis",

                        // grouping
                        "groupData": true,
                        "groupCount": 24 * 31,

                        // pre-zoom
                        "start": 0.75,
                        "end": 1,
                        "keepSelection": true,

                        // "cursorTooltipEnabled": false,

                        // "renderer": {

                        // "inside": true, // render labels inside chart
                        // },
                    },
                ],
                "yAxes": [
                    {
                        "type": "ValueAxis",
                        "id": "traffic",

                        "title": { "text": "Traffic" },

                        "min": 0,

                        // "max": 100,

                        // "logarithmic": true,

                        // "cursorTooltipEnabled": false,
                        // "numberFormatter": { "type": "NumberFormatter", "numberFormat": "#" },
                    },
                ],

                "series": [
                    {
                        "type": "ColumnSeries",

                        // "type": "LineSeries",
                        "id": "traffic_successful",
                        "name": "Successful",

                        "columns": {
                            "maxWidth": 30,
                        },

                        "yAxis": "traffic",

                        "dataFields": {
                            "dateX": "date",
                            "valueY": "successful",
                        },

                        "tooltipText": "Successful: {valueY.value}",

                        "fill": "blue",
                        "stroke": "blue",

                        // "strokeWidth": 2,
                        "tensionX": 0.8,
                        "connect": false,

                        // "numberFormatter": { "numberFormat": "#,###" },

                        // "fillOpacity": 0.3,
                        "stacked": true,

                        // "bullets": [{ "type": "CircleBullet", "circle": { "radius": 1 } }],
                    },
                    {
                        "type": "ColumnSeries",

                        // "type": "LineSeries",
                        "id": "traffic_errors",
                        "name": "Error",

                        "columns": {
                            "maxWidth": 30,
                        },

                        "yAxis": "traffic",

                        "dataFields": {
                            "dateX": "date",
                            "valueY": "errors",
                        },

                        "tooltipText": "Errors: {valueY.value}",

                        "fill": "red",
                        "stroke": "red",

                        "stacked": true,

                        // "strokeWidth": 2,
                        "tensionX": 0.8,
                        "connect": false,

                        // "numberFormatter": { "numberFormat": "#,###" },

                        // "fillOpacity": 0.3,

                        // "bullets": [{ "type": "CircleBullet", "circle": { "radius": 1 } }],
                    },
                ],
            } );

            this.refresh();
        },

        errorsChartReady ( chart ) {
            this.errorsChart = chart;

            chart.create( {
                "titles": [{ "text": "Errors Percent for Last 30 Days", "fontSize": 12 }],
                "type": "XYChart",

                "dateFormatter": {
                    "inputDateFormat": "yyyy-MM-dd HH:mm:ss",
                },

                // "responsive": { "enabled": true },
                "cursor": { "type": "XYCursor", "behavior": "zoomX" },

                "scrollbarX": {
                    "type": "XYChartScrollbar",
                    "series": ["errors_percent"],
                },

                "xAxes": [
                    {
                        "type": "DateAxis",

                        // grouping
                        "groupData": true,
                        "groupCount": 24 * 31,

                        // pre-zoom
                        "start": 0.75,
                        "end": 1,
                        "keepSelection": true,

                        // "cursorTooltipEnabled": false,

                        // "renderer": {

                        // "inside": true, // render labels inside chart
                        // },
                    },
                ],
                "yAxes": [
                    {
                        "type": "ValueAxis",
                        "id": "volume",

                        "title": { "text": "Errors (%)" },

                        // "calculateTotals": true,
                        "min": 0,
                        "max": 100,
                        "strictMinMax": true,

                        // "logarithmic": true,

                        // "cursorTooltipEnabled": false,
                        // "numberFormatter": { "type": "NumberFormatter", "numberFormat": "#" },
                    },
                ],

                "series": [
                    {
                        "type": "ColumnSeries",

                        // "type": "LineSeries",

                        "id": "errors_percent",
                        "name": "Error",

                        "columns": {
                            "maxWidth": 30,
                        },

                        "yAxis": "volume",

                        "dataFields": {
                            "dateX": "date",
                            "valueY": "errors_percent",
                        },

                        "tooltipText": "Errors: {valueY.value}%",

                        "fill": "red",
                        "stroke": "red",

                        // "stacked": true,

                        // "strokeWidth": 2,
                        "tensionX": 0.8,
                        "connect": false,

                        // "numberFormatter": { "numberFormat": "#,###" },

                        // "fillOpacity": 0.6,

                        // "bullets": [{ "type": "CircleBullet", "circle": { "radius": 1 } }],
                    },
                ],
            } );

            this.refresh();
        },

        async refresh () {
            if ( !this.trafficChart || !this.errorsChart ) return;

            this.$ext.mask();

            const res = await this.$api.call( "admin/api-call-log/read-stat-30-days" );

            this.$ext.unmask();

            if ( !res.ok ) {
                this.$.toast( res );

                this.$ext.hide();
            }

            this.trafficChart.setData( res.data.traffic );
        },
    },
};
</script>

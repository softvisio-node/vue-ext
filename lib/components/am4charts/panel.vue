<!--
# USAGE

yarn add @amcharts/amcharts4

import AmchartsPanel from "#softvisio/components/am4charts-panel";

<AmchartsPanel animated="false" @ready="chartsReady"/>

chartsReady (chart) {
    chart.create( amChartsConfig );

    chart.setStore(...);

    chart.dataHandler = function ( data ) { return data };

    chart.setData(...);
}

-->

<template>
    <ext-panel layout="fit" @ready="_ready"/>
</template>

<script>
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts"; // eslint-disable-line
import chartThemeAnimated from "@amcharts/amcharts4/themes/animated";
import chartThemeLight from "@amcharts/amcharts4/themes/material";
import chartThemeDark from "@amcharts/amcharts4/themes/amchartsdark";

am4core.options.commercialLicense = true;

export default {
    "props": {
        "animated": {
            "type": Boolean,
            "default": true,
        },
    },

    "computed": {
        darkMode () {
            return this.$store.theme.darkMode;
        },
    },

    "watch": {
        darkMode () {
            if ( !this.chart ) return;

            this.chart.dispose();

            this.chart = null;

            this.$emit( "ready", this );
        },
    },

    mounted () {
        this.$once( "hook:beforeDestroy", () => {

            // destroy chart
            if ( this.chart ) this.chart.dispose();
            this.chart = null;

            // destroy ext component
            if ( this.cmp ) this.cmp.destroy();
            this.cmp = null;
        } );
    },

    "methods": {
        _ready ( e ) {
            this.cmp = e.detail.cmp;

            if ( this.cmp.rendered ) {
                this._afterRender();
            }
            else {
                this.cmp.afterRender = this._afterRender.bind( this );
            }
        },

        _afterRender () {
            this.cmp.afterRender = null;

            this.$emit( "ready", this );
        },

        create ( config ) {

            // theme
            am4core.unuseAllThemes();
            if ( this.animated ) am4core.useTheme( chartThemeAnimated );
            am4core.useTheme( this.darkMode ? chartThemeDark : chartThemeLight );

            this.chart = am4core.createFromConfig( JSON.parse( JSON.stringify( config ) ), this.cmp.innerElement.dom );
        },

        setData ( data ) {
            this.chart.data = data;
        },

        setStore ( store ) {
            var oldStore = this.store,
                bindEvents = Ext.apply( {
                    "scope": this,
                },
                {
                    "dataChanged": this._onStoreDataChanged,
                } );

            if ( oldStore ) {
                oldStore.un( bindEvents );
            }

            this.store = store;

            store.on( bindEvents );

            this._onStoreDataChanged();
        },

        _onStoreDataChanged () {
            const data = Ext.Array.pluck( this.store.data.items, "data" );

            const dataHandler = this.dataHandler;

            if ( dataHandler ) {
                this.chart.data = dataHandler( data );
            }
            else {
                this.chart.data = data;
            }
        },
    },
};
</script>

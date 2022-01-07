<!--
# USAGE

yarn add @amcharts/amcharts4

import AmchartsPanel from "#vue/components/am4charts-panel";

<AmchartsPanel :animated="false" @ready="chartsReady"/>

chartsReady (chart) {
    chart.create( amChartsConfig );

    chart.setStore(...);

    chart.dataHandler = function ( data ) { return data };

    chart.setData(...);
}

-->

<template>
    <ext-panel layout="fit" @ready="ready"/>
</template>

<script>
import * as am4charts from "./loader.js";

export default {
    "props": {
        "animated": {
            "type": Boolean,
            "default": true,
        },
    },

    "emits": ["ready"],

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

    beforeUnmount () {

        // destroy chart
        if ( this.chart ) this.chart.dispose();
        this.chart = null;

        // destroy ext component
        if ( this.ext ) this.ext.destroy();
        this.ext = null;
    },

    "methods": {
        ready ( e ) {
            this.ext = e.detail.cmp;

            if ( this.ext.rendered ) {
                this._afterRender();
            }
            else {
                this.ext.afterRender = this._afterRender.bind( this );
            }
        },

        _afterRender () {
            this.ext.afterRender = null;

            this.$emit( "ready", this );
        },

        async create ( config ) {

            // theme
            am4charts.am4core.unuseAllThemes();
            if ( this.animated ) am4charts.am4core.useTheme( am4charts.chartThemeAnimated );
            am4charts.am4core.useTheme( this.darkMode ? am4charts.chartThemeDark : am4charts.chartThemeLight );

            this.chart = am4charts.am4core.createFromConfig( JSON.parse( JSON.stringify( config ) ), this.ext.innerElement.dom );
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

<template>
    <ext-panel layout="fit" @ready="_ready"/>
</template>

<script>
import * as amcharts from "./loader.js";

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
        async create ( config ) {

            // theme
            amcharts.am4core.unuseAllThemes();
            if ( this.animated ) amcharts.am4core.useTheme( amcharts.themeAnimated );
            amcharts.am4core.useTheme( this.darkMode ? amcharts.themeDark : amcharts.themeLight );

            this.chart = amcharts.am4core.createFromConfig( JSON.parse( JSON.stringify( config ) ), this.ext.innerElement.dom );
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

        // protected
        _ready ( e ) {
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

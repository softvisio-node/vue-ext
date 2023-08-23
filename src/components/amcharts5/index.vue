<template>
    <ext-container layout="fit" @ready="_ready"/>
</template>

<script>
import Events from "#core/events";
import * as amcharts from "./loader.js";
import "./ext.amcharts5.js";

export default {
    "props": {
        "createChart": {
            "type": Function,
            "required": true,
        },
        "updateChart": {
            "type": Function,
            "default": null,
        },
        "store": {
            "type": Object,
            "default": null,
        },
        "animated": {
            "type": Boolean,
            "default": false,
        },
        "responsive": {
            "type": Boolean,
            "default": false,
        },
        "micro": {
            "type": Boolean,
            "default": false,
        },
    },

    "watch": {
        store ( newValue, oldValue ) {
            this._unlinkStore( oldValue );

            this._linkStore( newValue );
        },
    },

    create () {
        this._linkStore( this.store );
    },

    beforeUnmount () {

        // unlink store
        this._unlinkStore( this.store );

        // unlink theme
        this._events?.clear();
        this._events = null;

        // destroy chart
        this._destroyChart();

        // destroy ext component
        if ( this.ext ) {
            this.ext.destroy();

            this.ext = null;
        }
    },

    "methods": {

        // public
        setData ( data ) {
            if ( this.updateChart ) {
                this.updateChart( this, data );
            }
            else {
                this._setData( data );
            }
        },

        // protected
        _setData ( data ) {
            const chart = this.root.container.children.values[0];

            chart.xAxes.values[0].data.setAll( data || [] );

            for ( const serie of chart.series ) {
                serie.data.setAll( data || [] );
            }
        },

        _backupData () {
            const data = {
                    "xAxes": [],
                    "series": [],
                },
                chart = this.root.container.children.values[0];

            for ( const xAxis of chart.xAxes.values ) {
                data.xAxes.push( xAxis.data.values );
            }

            for ( const serie of chart.series ) {
                data.series.push( serie.data.values );
            }

            return data;
        },

        _restoreData ( data ) {
            if ( this.store ) {
                this._setDataFromStore();
            }
            else if ( data ) {
                const chart = this.root.container.children.values[0];

                for ( const xAxis of chart.xAxes.values ) {
                    xAxis.data.setAll( data.xAxes.shift() );
                }

                for ( const serie of chart.series ) {
                    serie.data.setAll( data.series.shift() || [] );
                }
            }
        },

        _ready ( e ) {
            this.ext = e.detail.cmp;
            this.am5 = amcharts.am5;

            if ( this.ext.rendered ) {
                this._afterRender();
            }
            else {
                this.ext.afterRender = this._afterRender.bind( this );
            }
        },

        _afterRender () {
            this.ext.afterRender = null;

            this._createChart();
        },

        _createChart () {
            if ( this.root ) {
                var data = this._backupData();

                this._destroyChart();
            }

            this._events ??= new Events().link( this.$app.theme ).on( "darkModeChange", this._onThemeChange.bind( this ) );

            this.root = amcharts.am5.Root.new( this.ext.innerElement.dom );

            const themes = [];

            if ( this.animated ) themes.push( amcharts.themeAnimated.new( this.root ) );
            if ( this.responsive ) themes.push( amcharts.themeResponsive.new( this.root ) );
            if ( this.micro ) themes.push( amcharts.themeMicro.new( this.root ) );

            // color theme
            if ( this.$app.theme.darkMode ) {
                themes.push( amcharts.darkTheme.new( this.root ) );
            }
            else {
                themes.push( amcharts.lightTheme.new( this.root ) );
            }

            this.root.setThemes( themes );

            this.createChart( this );

            // restore data
            this._restoreData( data );
        },

        _destroyChart () {
            if ( !this.root ) return;

            this.root.dispose();

            this.root = null;
        },

        _linkStore ( store ) {
            if ( !store ) return;

            store.on( {
                "scope": this,
                "dataChanged": this._setDataFromStore,
            } );

            this._setDataFromStore();
        },

        _unlinkStore ( store ) {
            if ( !store ) return;

            store.un( {
                "scope": this,
                "dataChanged": this._setDataFromStore,
            } );
        },

        _setDataFromStore () {
            if ( !this.store ) return;

            if ( !this.root ) return;

            const data = Ext.Array.pluck( this.store.data.items, "data" );

            this.setData( data );
        },

        _onThemeChange () {
            if ( !this.root ) return;

            this._createChart();
        },
    },
};
</script>

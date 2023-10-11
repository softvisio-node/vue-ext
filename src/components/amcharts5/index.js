import "./ext-amcharts5.component.js";
import Events from "#core/events";
import * as amcharts from "./loader.js";
import app from "#app";

Ext.define( "Ext.amcharts5", {
    "extend": "Ext.Container",
    "xtype": "amcharts5",

    "defaultBindProperty": "data",

    "am5": amcharts.am5,

    // "createChart": null,
    "setChartData": null,
    "backupChartData": null,
    "restoreChartData": null,
    "store": null,
    "animated": true,
    "responsive": true,
    "micro": null,

    "config": {
        "createChart": null,
    },

    afterRender () {
        this._createChart();
    },

    setCreateChart ( f ) {
        console.log( "--- SET", typeof f );
    },

    // private
    _createChart () {
        if ( this.root ) {
            var data = this._backupData();

            this._destroyChart();
        }

        this._events ??= new Events().link( app.theme ).on( "darkModeChange", this._onThemeChange.bind( this ) );

        this.root = amcharts.am5.Root.new( this.innerElement.dom );

        // set locale
        this.root.locale = amcharts.locale;
        this.root.dateFormatter.set( "intlLocales", app.locale.id );
        this.root.numberFormatter.set( "intlLocales", app.locale.id );

        const themes = [];

        if ( this.animated ) themes.push( amcharts.ThemeAnimated.new( this.root ) );
        if ( this.responsive ) themes.push( amcharts.ThemeResponsive.new( this.root ) );
        if ( this.micro ) themes.push( amcharts.ThemeMicro.new( this.root ) );

        // color theme
        if ( app.theme.darkMode ) {
            themes.push( amcharts.DarkTheme.new( this.root ) );
        }
        else {
            themes.push( amcharts.LightTheme.new( this.root ) );
        }

        this.root.setThemes( themes );

        this.createChart( this );

        // restore data
        this._restoreData( data );
    },

    _onThemeChange () {
        if ( !this.root ) return;

        this._createChart();
    },

    _setData ( data ) {
        const chart = this.root.container.children.values[0];

        for ( const xAxis of chart.xAxes.values ) {
            xAxis.data.setAll( data || [] );
        }

        for ( const serie of chart.series ) {
            serie.data.setAll( data || [] );
        }
    },

    _backupData () {
        if ( this.backupChartData ) {
            return this.backupChartData( this );
        }
        else {
            const chart = this.root.container.children.values[0],
                data = {
                    "xAxes": [],
                    "series": [],
                };

            for ( const xAxis of chart.xAxes.values ) {
                data.xAxes.push( xAxis.data.values );
            }

            for ( const serie of chart.series ) {
                data.series.push( serie.data.values );
            }

            return data;
        }
    },

    _restoreData ( data ) {
        if ( this.store ) {
            this._setDataFromStore();
        }
        else if ( this.restoreChartData ) {
            this.restoreChartData( this, data );
        }
        else if ( data ) {
            const chart = this.root.container.children.values[0];

            if ( data.xAxes?.length ) {
                for ( const xAxis of chart.xAxes.values ) {
                    xAxis.data.setAll( data.xAxes.shift() );
                }
            }

            if ( data.series?.length ) {
                for ( const serie of chart.series ) {
                    serie.data.setAll( data.series.shift() || [] );
                }
            }
        }
    },
} );

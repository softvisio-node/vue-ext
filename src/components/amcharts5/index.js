import "./ext-amcharts5.component.js";
import Events from "#core/events";
import * as amcharts from "./loader.js";
import app from "#app";

Ext.define( "Ext.amcharts5", {
    "extend": "Ext.Container",
    "xtype": "amcharts5",

    "defaultBindProperty": "data",

    "am5": amcharts.am5,

    "config": {
        "createChart": null,
        "setChartData": null,
        "backupChartData": null,
        "restoreChartData": null,
        "store": null,
        "animated": true,
        "responsive": true,
        "micro": null,
    },

    afterRender () {
        this._createChart1();
    },

    // private
    _createChart1 () {
        if ( this.root1 ) {
            var data = this._backupData();

            this._destroyChart();
        }

        this._events ??= new Events().link( app.theme ).on( "darkModeChange", this._onThemeChange.bind( this ) );

        this.root1 = amcharts.am5.Root.new( this.innerElement.dom );

        // set locale
        this.root1.locale = amcharts.locale;
        this.root1.dateFormatter.set( "intlLocales", app.locale.id );
        this.root1.numberFormatter.set( "intlLocales", app.locale.id );

        const themes = [];

        if ( this.getAnimated() ) themes.push( amcharts.ThemeAnimated.new( this.root1 ) );
        if ( this.getResponsive() ) themes.push( amcharts.ThemeResponsive.new( this.root1 ) );
        if ( this.getMicro() ) themes.push( amcharts.ThemeMicro.new( this.root1 ) );

        // color theme
        if ( app.theme.darkMode ) {
            themes.push( amcharts.DarkTheme.new( this.root1 ) );
        }
        else {
            themes.push( amcharts.LightTheme.new( this.root1 ) );
        }

        this.root1.setThemes( themes );

        this.getCreateChart()( this );

        // restore data
        this._restoreData( data );
    },

    _onThemeChange () {
        if ( !this.root1 ) return;

        this._createChart1();
    },

    setData ( data ) {
        const chart = this.root1.container.children.values[0];

        for ( const xAxis of chart.xAxes.values ) {
            xAxis.data.setAll( data || [] );
        }

        for ( const serie of chart.series ) {
            serie.data.setAll( data || [] );
        }
    },

    _backupData () {
        if ( this.getBackupChartData() ) {
            return this.getBackupChartData()( this );
        }
        else {
            const chart = this.root1.container.children.values[0],
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
        if ( this.getStore() ) {
            this._setDataFromStore();
        }
        else if ( this.getRestoreChartData() ) {
            this.getRestoreChartData()( this, data );
        }
        else if ( data ) {
            const chart = this.root1.container.children.values[0];

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

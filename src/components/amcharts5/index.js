import "./ext-amcharts5.component.js";
import Events from "#core/events";
import * as amcharts from "./loader.js";
import app from "#app";

Ext.define( "Ext.amcharts5", {
    "extend": "Ext.Container",
    "xtype": "amcharts5",

    "defaultBindProperty": "data",

    "root": null,
    "am5": amcharts.am5,

    "config": {
        "store": null,
        "createChart": null,
        "setChartData": null,
        "backupChartData": null,
        "restoreChartData": null,
        "animated": true,
        "responsive": true,
        "micro": null,
    },

    afterRender () {
        this.createChart();
    },

    doDestroy () {

        // unlink store
        this.unlinkStore( this.getStore() );

        // unlink theme
        this._events?.clear();
        this._events = null;

        // destroy chart
        this.destroyChart();

        this.callParent( arguments );
    },

    setStpre ( newValue, oldValue ) {
        this.unlinkStore( oldValue );

        this.linkStore( newValue );
    },

    setData ( data ) {
        if ( this.getSetChartData() ) {
            data = this.getSetChartData()( this, data );

            if ( data ) this.upxateChartData( data );
        }
        else {
            this.upxateChartData( data );
        }
    },

    upxateChartData ( data ) {
        const chart = this.root.container.children.values[0];

        for ( const xAxis of chart.xAxes.values ) {
            xAxis.data.setAll( data || [] );
        }

        for ( const serie of chart.series ) {
            serie.data.setAll( data || [] );
        }
    },

    backupData () {
        if ( this.getBackupChartData() ) {
            return this.getBackupChartData()( this );
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

    restoreData ( data ) {
        if ( this.getStore() ) {
            this.setDataFromStore();
        }
        else if ( this.getRestoreChartData() ) {
            this.getRestoreChartData()( this, data );
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

    createChart () {
        if ( this.root ) {
            var data = this.backupData();

            this.destroyChart();
        }

        this._events ??= new Events().link( app.theme ).on( "darkModeChange", this.onThemeChange.bind( this ) );

        this.root = amcharts.am5.Root.new( this.innerElement.dom );

        // set locale
        this.root.locale = amcharts.locale;
        this.root.dateFormatter.set( "intlLocales", app.locale.id );
        this.root.numberFormatter.set( "intlLocales", app.locale.id );

        const themes = [];

        if ( this.getAnimated() ) themes.push( amcharts.ThemeAnimated.new( this.root ) );
        if ( this.getResponsive() ) themes.push( amcharts.ThemeResponsive.new( this.root ) );
        if ( this.getMicro() ) themes.push( amcharts.ThemeMicro.new( this.root ) );

        // color theme
        if ( app.theme.darkMode ) {
            themes.push( amcharts.DarkTheme.new( this.root ) );
        }
        else {
            themes.push( amcharts.LightTheme.new( this.root ) );
        }

        this.root.setThemes( themes );

        this.getCreateChart()( this );

        // restore data
        this.restoreData( data );
    },

    destroyChart () {
        if ( !this.root ) return;

        this.root.dispose();

        this.root = null;
    },

    linkStore ( store ) {
        if ( !store ) return;

        store.on( {
            "scope": this,
            "dataChanged": this.setDataFromStore,
        } );

        this.setDataFromStore();
    },

    unlinkStore ( store ) {
        if ( !store ) return;

        store.un( {
            "scope": this,
            "dataChanged": this.setDataFromStore,
        } );
    },

    setDataFromStore () {
        const store = this.getStore();

        if ( !store ) return;

        if ( !this.root ) return;

        const data = Ext.Array.pluck( store.data.items, "data" );

        this.setData( data );
    },

    onThemeChange () {
        if ( !this.root ) return;

        this.createChart();
    },
} );

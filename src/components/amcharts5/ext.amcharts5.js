import * as amcharts from "./loader.js";
import themeStore from "#src/stores/theme";

Ext.define( "Ext.amcharts5", {
    "extend": "Ext.Panel",
    "xtype": "amcharts5",

    "defaultBindProperty": "data",

    "animated": false,
    "responsive": false,
    "micro": false,

    "am5": amcharts.am5,
    "root": null,
    "createChart": null,
    "updateChart": null,

    "config": {
        "data": null,
        "store": null,
    },

    // public
    afterRender () {
        this._createRoot();
    },

    doDestroy () {
        if ( this._themeListener ) {
            themeStore.off( "darkModeChange", this._themeListener );
            this._themeListener = null;
        }

        if ( this.root ) {
            this.root.dispose();
            this.root = null;
        }

        // XXX
        try {
            this.callParent( arguments );
        }
        catch ( e ) {}
    },

    setData ( data ) {
        if ( this.updateChart ) {
            this.updateChart( this, data );
        }
        else {
            this._defaultUpdateChart( data );
        }
    },

    updateStore ( newStore, oldStore ) {
        const events = {
            "scope": this,
            "dataChanged": this._onStoreDataChanged,
        };

        if ( oldStore ) oldStore.un( events );

        if ( newStore ) {
            newStore.on( events );

            this._onStoreDataChanged();
        }
    },

    // protected
    _defaultUpdateChart ( data ) {
        const chart = this.root.container.children.values[0];

        chart.xAxes.values[0].data.setAll( data || [] );

        for ( const serie of chart.series ) {
            serie.data.setAll( data || [] );
        }
    },

    _createRoot () {
        if ( this.root ) return;

        if ( !this._themeListener ) {
            this._themeListener = this.onThemeChange.bind( this );
            themeStore.on( "darkModeChange", this._themeListener );
        }

        this.root = amcharts.am5.Root.new( this.innerElement.dom );

        const themes = [];

        if ( this.animated ) themes.push( amcharts.themeAnimated.new( this.root ) );
        if ( this.responsive ) themes.push( amcharts.themeResponsive.new( this.root ) );
        if ( this.micro ) themes.push( amcharts.themeMicro.new( this.root ) );

        // color theme
        if ( themeStore.darkMode ) {
            themes.push( amcharts.darkTheme.new( this.root ) );
        }
        else {
            themes.push( amcharts.lightTheme.new( this.root ) );
        }

        this.root.setThemes( themes );

        if ( this.createChart ) this.createChart( this );
    },

    _onStoreDataChanged () {
        const data = Ext.Array.pluck( this.getStore()?.data.items, "data" );

        this.setData( data );
    },

    onThemeChange ( theme ) {
        if ( this.root ) {
            this.root.dispose();
            this.root = null;

            this._createRoot();
        }
    },
} );

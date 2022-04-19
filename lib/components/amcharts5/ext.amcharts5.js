import * as amcharts from "./loader.js";

Ext.define( "Ext.amcharts5", {
    "extend": "Ext.Panel",
    "xtype": "amcharts5",

    "defaultBindProperty": "data",

    "animated": true,
    "responsive": false,
    "micro": false,

    "am5": amcharts.am5,
    "root": null,
    "createChart": null,
    "onData": null,

    "conig": {
        "data": null,
        "store": null,
    },

    // public
    initialize () {
        const themeRegistry = window[Symbol.for( "THEME_REGISTRY" )];

        if ( themeRegistry ) {
            this._themeListener = theme => this._createRoot();

            themeRegistry.on( "theme", this._themeListener );
        }

        // XXX
        // this.callParent( arguments );
    },

    afterRender () {
        this._createRoot();
    },

    doDestroy () {
        if ( this.root ) {
            this.root.dispose();
            this.root = null;
        }

        if ( this._themeListener ) {
            window[Symbol.for( "THEME_REGISTRY" )].off( "theme", this._themeListener );

            this._themeListener = null;
        }

        this.callParent( arguments );
    },

    updateData ( data ) {
        if ( this.onData ) this.onData( this, data );
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
    _createRoot () {
        if ( this.root ) {
            this.root.dispose();
            this.root = null;
        }

        this.root = amcharts.am5.Root.new( this.innerElement.dom );

        const themeRegistry = window[Symbol.for( "THEME_REGISTRY" )];

        const themes = [];

        if ( this.animated ) themes.push( amcharts.themeAnimated.new( this.root ) );
        if ( this.responsive ) themes.push( amcharts.themeResponsive.new( this.root ) );
        if ( this.micro ) themes.push( amcharts.themeMicro.new( this.root ) );

        themes.push( themeRegistry.theme.darkMode ? amcharts.themeDark.new( this.root ) : amcharts.themeLight.new( this.root ) );

        this.root.setThemes( themes );

        if ( this.createChart ) this.createChart( this );
    },

    _onStoreDataChanged () {
        const data = Ext.Array.pluck( this.getStore()?.data.items, "data" );

        this.setData( data );
    },
} );

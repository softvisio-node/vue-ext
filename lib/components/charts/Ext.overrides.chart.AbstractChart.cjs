const DARK_THEME = process.env.VUE_APP_CHARTS_DARK_THEME || "midnight",
    LIGHT_THEME = process.env.VUE_APP_CHARTS_LIGHT_THEME || "green";

Ext.define( "Ext.overrides.chart.AbstractChart", {
    "override": "Ext.chart.AbstractChart",

    "config": {
        "downloadServerUrl": "https://www.google.com/",
    },

    initialize () {
        this.setDarkMode( window[Symbol.for( "THEME_REGISTRY" )].darkMode );

        this._darkModeListener = darkMode => this.setDarkMode( darkMode );

        window[Symbol.for( "THEME_REGISTRY" )].on( "darkMode", this._darkModeListener );

        this.callParent( arguments );
    },

    doDestroy () {
        window[Symbol.for( "THEME_REGISTRY" )].ofn( "darkMode", this._darkModeListener );

        this._darkModeListener = null;

        this.callParent( arguments );
    },

    setDarkMode ( darkMode ) {
        this.setTheme( darkMode ? DARK_THEME : LIGHT_THEME );
    },
} );

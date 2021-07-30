Ext.define( "Ext.overrides.chart.AbstractChart", {
    "override": "Ext.chart.AbstractChart",

    initialize () {
        window[Symbol.for( "THEME_REGISTRY" )].register( this );

        this.callParent( arguments );
    },

    doDestroy () {
        window[Symbol.for( "THEME_REGISTRY" )].unregister( this );

        this.callParent( arguments );
    },
} );

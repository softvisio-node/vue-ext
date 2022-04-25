import * as amcharts from "./loader.js";

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

    "config": {
        "data": null,
        "store": null,
    },

    // public
    afterRender () {
        this._createRoot();
    },

    doDestroy () {
        if ( this.root ) {
            this.root.dispose();
            this.root = null;
        }

        this.callParent( arguments );
    },

    setData ( data ) {
        if ( this.updateChart ) this.updateChart( this, data );
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

    updateChart ( cmp, data ) {
        const chart = cmp.root.container.children.values[0];

        chart.xAxes.values[0].data.setAll( data || [] );

        for ( const serie of chart.series ) {
            serie.data.setAll( data || [] );
        }
    },

    // protected
    _createRoot () {
        if ( this.root ) return;

        this.root = amcharts.am5.Root.new( this.innerElement.dom );

        const themes = [];

        if ( this.animated ) themes.push( amcharts.themeAnimated.new( this.root ) );
        if ( this.responsive ) themes.push( amcharts.themeResponsive.new( this.root ) );
        if ( this.micro ) themes.push( amcharts.themeMicro.new( this.root ) );
        themes.push( amcharts.theme.new( this.root ) );

        this.root.setThemes( themes );

        if ( this.createChart ) this.createChart( this );
    },

    _onStoreDataChanged () {
        const data = Ext.Array.pluck( this.getStore()?.data.items, "data" );

        this.setData( data );
    },
} );

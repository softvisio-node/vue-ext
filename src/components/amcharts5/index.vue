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

    "emits": ["refresh"],

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
            this.hasData = true;

            if ( this.updateChart ) {
                this.updateChart( this, data );
            }
            else {
                this._defaultUpdateChart( data );
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
            var hasData;

            if ( this.root ) {
                hasData = this.hasData;

                this._destroyChart();
            }

            this._events ??= new Events().link( this.$app.theme ).on( "darkModeChange", this._onThemeChange.bind( this ) );

            if ( !this._rootEl ) {
                this._rootEl = document.createElement( "div" );

                this._rootEl.style.width = "100%";
                this._rootEl.style.height = "100%";

                this.ext.innerElement.dom.appendChild( this._rootEl );
            }

            this.root = amcharts.am5.Root.new( this._rootEl );

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

            // automatically set data from store
            if ( this.store ) {
                this._setDataFromStore();
            }
            else if ( hasData ) {
                this.$emit( "refresh", this );
            }
        },

        _destroyChart () {
            if ( !this.root ) return;

            this.root.dispose();

            this.root = null;
            this.hasData = false;
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

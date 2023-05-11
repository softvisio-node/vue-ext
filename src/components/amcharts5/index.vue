<template>
    <ext-panel layout="fit" @ready="_ready"/>
</template>

<script>
import * as amcharts from "./loader.js";
import "./ext.amcharts5.js";
import themeStore from "#src/stores/theme";

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

    "emits": ["chartReady"],

    // XXX unlink store
    beforeUnmount () {
        if ( this._themeListener ) {
            themeStore.off( "darkModeChange", this._themeListener );
            this._themeListener = null;
        }

        // destroy chart
        this._destroyRoot();

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

        // XXX
        _setStore ( store ) {
            const events = {
                "scope": this,
                "dataChanged": this._setDataFromStore,
            };

            // remove old store
            if ( this._store ) {
                this._store.un( events );

                this._store = null;
            }

            // set new store
            if ( store ) {
                this._store = store;

                this._store.on( events );

                this._setDataFromStore();
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

            this._createRoot();
        },

        _createRoot () {
            if ( this.root ) return;

            if ( !this._themeListener ) {
                this._themeListener = this._onThemeChange.bind( this );
                themeStore.on( "darkModeChange", this._themeListener );
            }

            this.root = amcharts.am5.Root.new( this.ext.innerElement.dom );

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

            this.createChart( this );

            this.chartReady = true;

            // automatically set data from store
            if ( this._store ) {
                this._setDataFromStore();
            }

            this.$emit( "chartReady", this );
        },

        _setDataFromStore () {
            if ( !this._store ) return;

            const data = Ext.Array.pluck( this._store?.data.items, "data" );

            this.setData( data );
        },

        _onThemeChange ( theme ) {
            if ( !this.root ) return;

            this._destroyRoot();

            this._createRoot();
        },

        _destroyRoot () {
            if ( !this.root ) return;

            this.chartReady = false;

            this.root.dispose();
            this.root = null;
        },
    },
};
</script>

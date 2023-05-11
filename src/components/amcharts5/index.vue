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

    "emits": ["refresh"],

    "watch": {
        store ( newValue, oldValue ) {
            this._unlinkStore( oldValue );

            this._linkStore( newValue );
        },
    },

    beforeUnmount () {

        // unlink store
        this._unlinkStore( this.store );

        // unlink theme
        if ( this._themeListener ) {
            themeStore.off( "darkModeChange", this._themeListener );
            this._themeListener = null;
        }

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
            var refresh;

            if ( this.root ) {
                this._destroyChart();

                refresh = true;
            }

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

            // automatically set data from store
            if ( this.store ) {
                this._setDataFromStore();
            }
            else if ( this.hasData ) {
                this.hasData = false;

                if ( refresh ) {
                    this.$emit( "refresh", this );
                }
            }
        },

        _setDataFromStore () {
            if ( !this.store ) return;

            const data = Ext.Array.pluck( this.store.data.items, "data" );

            this.setData( data );
        },

        _onThemeChange ( theme ) {
            if ( !this.root ) return;

            this._createChart();
        },

        _destroyChart () {
            if ( !this.root ) return;

            this.root.dispose();
            this.root = null;
        },

        _linkStore ( store ) {
            if ( !store ) return;

            const events = {
                "scope": this,
                "dataChanged": this._setDataFromStore,
            };

            store.on( events );

            this._setDataFromStore();
        },

        _unlinkStore ( store ) {
            if ( !store ) return;

            const events = {
                "scope": this,
                "dataChanged": this._setDataFromStore,
            };

            store.un( events );
        },
    },
};
</script>

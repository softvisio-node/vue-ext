<template>
    <ext-panel layout="fit" @ready="_ready"/>
</template>

<script>
import * as amcharts from "./loader.js";
import "./ext.amcharts5.js";
import themeStore from "#src/stores/theme";

export default {
    "props": {
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

    "emits": ["ready"],

    beforeUnmount () {
        if ( this._themeListener ) {
            themeStore.off( "darkModeChange", this._themeListener );
            this._themeListener = null;
        }

        // destroy chart
        if ( this.root ) {
            this.root.dispose();
            this.root = null;
        }

        // destroy ext component
        if ( this.ext ) {
            this.ext.destroy();

            this.ext = null;
        }
    },

    "methods": {

        // public
        setStore ( newStore ) {
            const oldStore = this.store,
                events = {
                    "scope": this,
                    "dataChanged": this._onStoreDataChanged,
                };

            this.store = newStore;

            if ( oldStore ) oldStore.un( events );

            if ( newStore ) {
                newStore.on( events );

                this._onStoreDataChanged();
            }
        },

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
                this._themeListener = this.onThemeChange.bind( this );
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

            this.$emit( "ready", this );
        },

        _onStoreDataChanged () {
            const data = Ext.Array.pluck( this.store?.data.items, "data" );

            this.setData( data );
        },

        onThemeChange ( theme ) {
            if ( this.root ) {
                this.root.dispose();
                this.root = null;

                this._createRoot();
            }
        },
    },
};
</script>

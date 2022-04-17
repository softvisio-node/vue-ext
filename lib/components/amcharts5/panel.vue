<template>
    <ext-panel layout="fit" @ready="ready"/>
</template>

<script>
import * as amcharts from "./loader.js";

export default {
    "props": {
        "animated": {
            "type": Boolean,
            "default": true,
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

    "computed": {
        darkMode () {
            return this.$store.theme.darkMode;
        },
    },

    "watch": {
        darkMode () {
            if ( !this.root ) return;

            this.root.dispose();

            this.root = null;

            this._create();
        },
    },

    beforeUnmount () {

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
        ready ( e ) {
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

            this._create();
        },

        _create ( config ) {
            if ( this.root ) return;

            this.root = amcharts.am5.Root.new( this.ext.innerElement.dom );

            const themes = [];

            if ( this.animated ) themes.push( amcharts.themeAnimated.new( this.root ) );
            if ( this.responsive ) themes.push( amcharts.themeResponsive.new( this.root ) );
            if ( this.micro ) themes.push( amcharts.themeMicro.new( this.root ) );
            themes.push( this.darkMode ? amcharts.themeDark.new( this.root ) : amcharts.themeLight.new( this.root ) );

            this.root.setThemes( themes );

            this.$emit( "ready", this );
        },

        // XXX
        setData ( data ) {
            this.root.data = data;
        },

        setStore ( store ) {
            var oldStore = this.store,
                bindEvents = Ext.apply( {
                    "scope": this,
                },
                {
                    "dataChanged": this._onStoreDataChanged,
                } );

            if ( oldStore ) {
                oldStore.un( bindEvents );
            }

            this.store = store;

            store.on( bindEvents );

            this._onStoreDataChanged();
        },

        // XXX
        _onStoreDataChanged () {
            const data = Ext.Array.pluck( this.store.data.items, "data" );

            const dataHandler = this.dataHandler;

            if ( dataHandler ) {
                this.root.data = dataHandler( data );
            }
            else {
                this.root.data = data;
            }
        },
    },
};
</script>

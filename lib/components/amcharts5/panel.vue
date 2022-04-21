<template>
    <ext-panel layout="fit" @ready="_ready"/>
</template>

<script>
import * as amcharts from "./loader.js";
import "./ext.amcharts5.js";

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

    "emits": ["ready", "data"],

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
            if ( this.updateChart ) this.updateChart( this, data );
            else this.$emit( "data", this, data );
        },

        // protected
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

            this.root = amcharts.am5.Root.new( this.ext.innerElement.dom );

            const themes = [];

            if ( this.animated ) themes.push( amcharts.themeAnimated.new( this.root ) );
            if ( this.responsive ) themes.push( amcharts.themeResponsive.new( this.root ) );
            if ( this.micro ) themes.push( amcharts.themeMicro.new( this.root ) );
            themes.push( amcharts.theme.new( this.root ) );

            this.root.setThemes( themes );

            this.$emit( "ready", this );
        },

        _onStoreDataChanged () {
            const data = Ext.Array.pluck( this.store?.data.items, "data" );

            this.setData( data );
        },
    },
};
</script>

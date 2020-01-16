<!--
yarn add worker-loader pdfjs-dist

<swc-pdf src="" scale="1">

Events:
ready(this);
afterPdfLoad(error);
-->

<template>
    <ext-panel layout="fit" scrollable="true" @ready="ready"/>
</template>

<script>
import Vue from "vue";
import pdfjs from "pdfjs-dist/webpack";

export default Vue.component( "SwcPdf", {
    "props": {
        "src": {
            "type": String,
            "default": null,
        },
        "scale": {
            "type": Number,
            "default": 1,
        },
    },

    data () {
        return {
            "cmp": null,
            "pdf": null,
            "lastSrc": null,
        };
    },

    "methods": {
        ready ( e ) {
            this.cmp = e.detail.cmp;

            this.$watch( "src", this._load.bind( this ) );

            this.$emit( "ready", this );

            if ( this.src ) this.setSrc( this.src );
        },

        getSrc () {
            return this.lastSrc;
        },

        setSrc ( src ) {
            if ( !src ) {
                this.clear();
            }
            else {
                this.lastSrc = src;

                this._load();
            }
        },

        clear () {
            this.cmp.setHtml( "" );

            this.pdf = null;

            this.lastSrc = null;
        },

        reload () {
            this._load();
        },

        _load () {
            if ( !this.lastSrc ) return;

            var me = this,
                cmp = this.cmp;

            pdfjs
                .getDocument( this.lastSrc )
                .promise.then( function ( pdf ) {
                    var numPages = pdf.numPages,
                        container = document.createElement( "div" );

                    cmp.setHtml( "" );
                    me.pdf = pdf;

                    container.setAttribute( "style", "display:flex;flex-direction:column;justify-content:flex-start;text-align:center;width:100%;" );

                    // el.appendChild( container );
                    cmp.setHtml( container );

                    for ( var i = 1; i <= numPages; i++ ) {
                        // fetch page
                        pdf.getPage( i ).then( function ( page ) {
                            var viewport = page.getViewport( { "scale": me.scale } );

                            // Prepare canvas using PDF page dimensions
                            var div = document.createElement( "div" );
                            container.appendChild( div );

                            var canvas = document.createElement( "canvas" );
                            div.appendChild( canvas );

                            var context = canvas.getContext( "2d" );
                            canvas.height = viewport.height;
                            canvas.width = viewport.width;

                            // Render PDF page into canvas context
                            var renderContext = {
                                "canvasContext": context,
                                "viewport": viewport,
                            };

                            page.render( renderContext );
                        } );
                    }

                    me.$emit( "afterPdfLoad", false );
                } )
                .catch( function ( error ) {
                    me.$emit( "afterPdfLoad", error.message );
                } );
        },
    },
} );
</script>

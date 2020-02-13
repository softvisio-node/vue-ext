<!--
yarn add worker-loader pdfjs-dist

<swc-pdf src="" scale="1">

Events:
ready(this);
-->

<template>
    <ext-panel layout="center" scrollable="true" @ready="ready"/>
</template>

<script>
import pdfjs from "pdfjs-dist/webpack";

export default {
    "props": {
        "src": {
            "type": String,
            "default": null,
        },
        "scale": {
            "type": String,
            "default": "auto",
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

            if ( this.cmp.rendered ) {
                this._afterRender();
            }
            else {
                this.cmp.afterRender = this._afterRender.bind( this );
            }
        },

        _afterRender () {
            this.cmp.afterRender = null;

            this.cmp.el.on( {
                "scope": this,
                "buffer": 300,
                "pinch": this.onPinch,
            } );

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

        async _load () {
            if ( !this.lastSrc ) return;

            var me = this,
                cmp = this.cmp;

            cmp.mask();

            const loadingTask = pdfjs.getDocument( this.lastSrc );

            // loadingTask.onProgress = function ( progress ) {
            //     var percent = parseInt( ( progress.loaded / progress.total ) * 100 );
            // };

            const pdf = await loadingTask.promise;

            const numPages = pdf.numPages,
                container = document.createElement( "div" );

            cmp.setHtml( "" );
            me.pdf = pdf;

            container.setAttribute( "style", "display:flex;flex-direction:column;justify-content:flex-start;text-align:center;width:100%;" );

            // el.appendChild( container );
            cmp.setHtml( container );

            var parentWidth = cmp.element.getWidth() - 30;
            // var parentHeight = cmp.element.getHeight();

            for ( var i = 1; i <= numPages; i++ ) {
                // fetch page
                const page = await pdf.getPage( i );

                const pageViewport = page.getViewport( { "scale": 1 } );

                let pageScale = me.scale;

                if ( pageScale === "auto" ) {
                    pageScale = parentWidth / pageViewport.width;
                }

                var viewport = page.getViewport( { "scale": pageScale } );

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
            }

            cmp.unmask();
        },

        onPinch ( e ) {
            console.log( e );
        },
    },
};
</script>

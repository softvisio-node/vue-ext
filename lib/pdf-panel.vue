<!--
yarn add worker-loader pdfjs-dist

<swc-pdf src="" scale="1">

Events:
ready(this);

https://rossta.net/blog/building-a-pdf-viewer-with-vue-part-1.html
-->

<template>
    <ext-container layout="center" scrollable="true" @ready="ready"/>
</template>

<script>
import pdfjs from "pdfjs-dist/webpack";

const pixelRatio = window.devicePixelRatio || 1;

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
        "resetZoomOnLoad": {
            "type": Boolean,
            "default": true,
        },
        "zoomStep": {
            "type": Number,
            "default": 0.1,
        },
        "minZoom": {
            "type": Number,
            "default": 0.5,
        },
        "maxZoom": {
            "type": Number,
            "default": 2,
        },
    },

    data () {
        return {
            "cmp": null,

            "currentSrc": null,
            "currentZoom": 1,

            "pdfDoc": null,
            "pdfPages": [],
        };
    },

    "watch": {
        "src": "setSrc",
    },

    "methods": {
        ready ( e ) {
            this.cmp = e.detail.cmp;

            Ext.widget( "container", {
                "floating": true,
                "renderTo": this.cmp,
                "style": "position: absolute; bottom: 20px; right: 20px;",
                "layout": {
                    "type": "vbox",
                },

                "items": [
                    { "xtype": "button", "iconCls": "fas fa-search-plus", "ui": "action", "handler": this.zoomIn.bind( this, null ) },
                    { "xtype": "container", "height": "10" },
                    { "xtype": "button", "iconCls": "fas fa-arrows-alt", "ui": "action", "handler": this.resetZoom.bind( this ) },
                    { "xtype": "container", "height": "10" },
                    { "xtype": "button", "iconCls": "fas fa-search-minus", "ui": "action", "handler": this.zoomOut.bind( this, null ) },
                ],
            } );

            if ( this.src ) this.setSrc( this.src );

            if ( this.cmp.rendered ) {
                this._afterRender();
            }
            else {
                this.cmp.afterRender = this._afterRender.bind( this );
            }
        },

        async _afterRender () {
            this.cmp.afterRender = null;

            // this.cmp.el.on( {
            //     "scope": this,
            //     "buffer": 300,
            //     "pinch": this._onPinch,
            // } );

            await this._renderPdfDoc();

            this.$emit( "ready", this );
        },

        // zoom
        zoomIn ( zoomStep ) {
            var newZoom = this.currentZoom + ( zoomStep || this.zoomStep );

            this.setZoom( newZoom );
        },

        zoomOut ( zoomStep ) {
            var newZoom = this.currentZoom - ( zoomStep || this.zoomStep );

            this.setZoom( newZoom );
        },

        resetZoom () {
            this.setZoom( 1 );
        },

        setZoom ( newZoom ) {
            if ( newZoom === this.currentZoom ) {
                return;
            }
            else if ( newZoom < this.minZoom ) {
                newZoom = this.minZoom;
            }
            else if ( newZoom > this.maxZoom ) {
                newZoom = this.maxZoom;
            }

            if ( newZoom !== this.currentZoom ) {
                this.currentZoom = newZoom;

                this._scale();
            }
        },

        // src
        getSrc () {
            return this.currentSrc;
        },

        setSrc ( src ) {
            if ( !src ) {
                this.clear();
            }
            else {
                this.currentSrc = src;

                this._renderPdfDoc();
            }
        },

        clear () {
            this.cmp.setHtml( "" );

            this.pdfDoc = null;
            this.pdfPages = [];

            this.currentSrc = null;
            this.currentZoom = 1;
        },

        reload () {
            this._renderPdfDoc();
        },

        async _renderPdfDoc () {
            if ( !this.cmp.rendered ) return;

            if ( !this.currentSrc ) return;

            if ( this.resetZoomOnLoad ) this.currentZoom = 1;

            var cmp = this.cmp;

            cmp.mask();

            const loadingTask = pdfjs.getDocument( this.currentSrc );

            // loadingTask.onProgress = function ( progress ) {
            //     var percent = parseInt( ( progress.loaded / progress.total ) * 100 );
            // };

            const pdfDoc = await loadingTask.promise;

            const numPages = pdfDoc.numPages,
                container = document.createElement( "div" );

            cmp.setHtml( "" );
            this.pdfDoc = pdfDoc;

            // cmp.el.appendChild( container );
            cmp.setHtml( container );

            container.style = "display:flex;flex-direction:column;justify-content:flex-start;text-align:center;width:100%;height:100%;";

            for ( var i = 1; i <= numPages; i++ ) {
                // fetch page
                const page = await pdfDoc.getPage( i );

                await this._renderPdfPage( container, page );
            }

            cmp.unmask();
        },

        async _renderPdfPage ( container, page ) {
            var cmp = this.cmp,
                scale = this.scale,
                viewport;

            if ( scale === "auto" ) {
                var parentWidth = cmp.element.getWidth() - 30;
                // var parentHeight = cmp.element.getHeight();

                viewport = page.getViewport( { "scale": 1 } );

                scale = ( parentWidth / viewport.width ) * pixelRatio;

                viewport = viewport.clone( { "scale": scale } );
            }
            else {
                scale = scale * pixelRatio;

                viewport = page.getViewport( { "scale": scale } );
            }

            // create canvas
            var canvas = document.createElement( "canvas" );

            var context = canvas.getContext( "2d" );
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            canvas.style = this._getCanvasStyle( viewport, scale );

            container.appendChild( canvas );

            // Render PDF page into canvas context
            var renderContext = {
                "canvasContext": context,
                "viewport": viewport,
            };

            // var renderTask =
            await page.render( renderContext ).promise;

            this.pdfPages.push( {
                "canvas": canvas,
                "viewport": viewport,
                "scale": scale,
            } );
        },

        _getCanvasStyle ( viewport, scale ) {
            var actualSizeViewport = viewport.clone( { "scale": scale } );

            var pixelWidth = Math.ceil( actualSizeViewport.width / pixelRatio );
            var pixelHeight = Math.ceil( actualSizeViewport.height / pixelRatio );

            var style = `width: ${pixelWidth}px; height: ${pixelHeight}px;`;

            return style;
        },

        _scale () {
            for ( const page of this.pdfPages ) {
                var style = this._getCanvasStyle( page.viewport, page.scale * this.currentZoom );

                page.canvas.style = style;
            }
        },

        // _onPinch ( e ) {
        //     if ( e.type === "pinch" ) {
        //         if ( e.scale > 1 ) {
        //             this.zoomIn( e.scale );
        //         }
        //         else {
        //             this.zoomOut( e.scale );
        //         }
        //     }

        //     // distance: 424.1556318145499
        //     // scale: 3.4347119095550567
        //     // type: "pinch"

        //     // distance: 113.35784048754634
        //     // scale: 0.29411071738462125
        //     // type: "pinch"
        //     else {
        //         this.zoomIn( 0.1 );
        //     }
        // },
    },
};
</script>

<!--
yarn add pdfjs-dist

<swc-pdf src="" scale="1">

Events:
ready
-->

<template>
    <ext-panel layout="fit" scrollable="true" @ready="ready"/>
</template>

<script>
import pdfjsLib from "pdfjs-dist";
// import pdfjsWorker from "pdfjs-dist/build/pdf.worker.js";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry.js";

import Vue from "vue";

export default Vue.component( "swc-pdf", {
    "name": "SwcPdf",

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
        };
    },

    "methods": {
        // TODO global worker
        ready ( e ) {
            var cmp = ( this.cmp = e.detail.cmp );

            this.$watch( "src", this._load.bind( this ) );

            pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

            if ( this.src ) this._load();

            this.$emit( "ready", this );
        },

        // TODO events
        _load () {
            var me = this,
                cmp = this.cmp;

            pdfjsLib
                .getDocument( this.src )
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

                    // view.fireEvent( "afterPdfLoad", false );
                } )
                .catch( function ( error ) {
                    // view.fireEvent( "afterPdfLoad", error.message );
                } );
        },

        clear () {
            this.cmp.setHtml( "" );

            this.pdf = null;
        },

        reload () {
            if ( this.src ) this._load();
        },
    },
} );
</script>
<!-- -----SOURCE FILTER LOG BEGIN----- -->
<!-- -->
<!-- +-------+---------------+------------------------------+--------------------------------------------------------------------------------+ -->
<!-- | Sev.  | Line:Col      | Rule                         | Description                                                                    | -->
<!-- |=======+===============+==============================+================================================================================| -->
<!-- |  WARN | 45:17         | no-unused-vars               | 'cmp' is assigned a value but never used.                                      | -->
<!-- |-------+---------------+------------------------------+--------------------------------------------------------------------------------| -->
<!-- |  WARN | 103:36        | no-unused-vars               | 'error' is defined but never used.                                             | -->
<!-- +-------+---------------+------------------------------+--------------------------------------------------------------------------------+ -->
<!-- -->
<!-- -----SOURCE FILTER LOG END----- -->

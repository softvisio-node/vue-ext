// <ext-dialog @ready="ready" closeAction="destroy">
import Vue from "vue";

const Dialog = {
    created () {
        // set Vue component destroy hook
        this.$once( "hook:beforeDestroy", () => {
            this.$emit( "destroy" );

            this.onDestroy();

            if ( this.$ext ) {
                this.$ext.destroy();

                this.$ext = null;
            }
        } );
    },

    "methods": {
        ready ( e ) {
            this.$ext = e.detail.cmp;

            // set Ext.Dialog destroy listener
            this.$ext.on( "destroy",
                function () {
                    this.$destroy();
                }.bind( this ) );

            this.$ext.on( "hide",
                function () {
                    this.$emit( "hide" );

                    this.onHide();
                }.bind( this ) );

            this.$ext.on( "show",
                function () {
                    this.$emit( "show" );

                    this.onShow();
                }.bind( this ) );

            this.$emit( "ready" );

            this.onReady();
        },

        show ( animation ) {
            this.$ext.show( animation );
        },

        showBy ( cmp, align, opts ) {
            this.$ext.showBy( cmp, align, opts );
        },

        showAt ( x, y ) {
            this.$ext.showAt( x, y );
        },

        hide () {
            this.$ext.hide();
        },

        // template method
        onReady () {},
        onShow () {},
        onHide () {},
        onDestroy () {},
    },
};

export default async function ( cmp, propsData ) {
    // async component
    if ( typeof cmp === "function" ) {
        cmp = await cmp();

        cmp = cmp.default;

        // if ( isESModule( cmp ) ) {
        //     cmp = cmp.default;
        // }
    }

    cmp.extends = Dialog;

    const component = Vue.extend( cmp );

    const object = new component( { propsData } );

    // mount vue component
    object.$mount();

    // append to the viewport
    Ext.Viewport.el.dom.appendChild( object.$el );

    return new Promise( function ( resolve ) {
        object.$once( "ready", function () {
            resolve( object );
        } );
    } );
}

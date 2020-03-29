// <ext-dialog @ready="ready" closeAction="destroy">

module.exports = {
    created () {
        // set Vue component destroy hook
        this.$once( "hook:beforeDestroy", () => {
            this.$emit( "destroy" );

            this.onDestroy();

            if ( this.dialog ) {
                this.dialog.destroy();

                this.dialog = null;
            }
        } );
    },

    data () {
        return {
            "dialog": null,
        };
    },

    "methods": {
        ready ( e ) {
            this.dialog = e.detail.cmp;

            // set Ext.Dialog destroy listener
            this.dialog.on( "destroy",
                function () {
                    this.$destroy();
                }.bind( this ) );

            this.dialog.on( "hide",
                function () {
                    this.$emit( "hide" );

                    this.onHide();
                }.bind( this ) );

            this.dialog.on( "show",
                function () {
                    this.$emit( "show" );

                    this.onShow();
                }.bind( this ) );

            this.$emit( "ready" );

            this.onReady();
        },

        show ( animation ) {
            this.dialog.show( animation );
        },

        showBy ( cmp, align, opts ) {
            this.dialog.showBy( cmp, align, opts );
        },

        showAt ( x, y ) {
            this.dialog.showAt( x, y );
        },

        hide () {
            this.dialog.hide();
        },

        // template method
        onReady () {},
        onShow () {},
        onHide () {},
        onDestroy () {},
    },
};

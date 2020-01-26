// <ext-dialog @ready="ready" closeAction="destroy">

module.exports = {
    data () {
        return {
            "dialog": null,
        };
    },

    created () {
        this.$mount();

        Ext.Viewport.el.dom.appendChild( this.$el );

        // set Vue component destroy hook
        this.$once( "hook:beforeDestroy", () => {
            if ( this.dialog ) {
                this.dialog.destroy();

                this.dialog = null;
            }
        } );
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
                }.bind( this ) );

            this.dialog.on( "show",
                function () {
                    this.$emit( "show" );
                }.bind( this ) );
        },

        show () {
            this.dialog.show();
        },

        hide () {
            this.dialog.hide();
        },
    },
};

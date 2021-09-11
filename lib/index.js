import "#ext";
import "#ewc";
import createApp from "@softvisio/vue";
import Router from "#lib/router";
import( "@fortawesome/fontawesome-free/css/all.min.css" );

export default async function ( globalProperties = {} ) {
    const app = createApp( globalProperties );

    // app.config.isCustomElement = tag => tag.startsWith( "ext-" );

    app.use( Router );

    // components requires .toString() method, because ext is trying to convert component to string when component is passed as scope to .on() call
    app.config.globalProperties.toString = function () {
        return null;
    };

    return new Promise( resolve => {
        Ext.application( {
            "name": "-",
            "quickTips": true,
            "api": app.config.globalProperties.$api,
            "launch": () => {

                // XXX
                // This is related to issue, when first displayed floated dialog is displayed without animation.
                // And cant' be closed, because animation is on unfinished state.
                // As workaround we can call cmp.activeAnimation.stop() before hide() call;
                const dialog = Ext.Viewport.add( {
                    "xtype": "dialog",
                    "modal": false,
                    "width": 1000,
                    "height": 11000,
                } );

                dialog.show( null );
                if ( dialog.activeAnimation ) dialog.activeAnimation.stop();
                dialog.hide( { "type": "slide", "duration": 1, "easing": "ease-out" } );
                dialog.destroy();

                resolve( app );
            },
        } );
    } );
}

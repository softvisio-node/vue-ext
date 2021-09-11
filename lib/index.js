import "#ext";
import "#ewc";
import( "@fortawesome/fontawesome-free/css/all.min.css" );
import _App from "@softvisio/vue";
import Router from "#lib/router";

export default class App extends _App {

    // public
    async init () {
        await super.init();

        this.vue.use( Router );

        // components requires .toString() method, because ext is trying to convert component to string when component is passed as scope to .on() call
        this.vue.config.globalProperties.toString = function () {
            return null;
        };

        return new Promise( resolve => {
            Ext.application( {
                "name": "-",
                "quickTips": true,
                "api": this.api,
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

                    resolve();
                },
            } );
        } );
    }
}

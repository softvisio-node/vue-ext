import "#ext";
import "#ewc";
import "@fortawesome/fontawesome-free/css/all.min.css";
import VueViewport from "@softvisio/vue/viewport1";
import Router from "#src/router";

export default class VueExtViewport extends VueViewport {

    // public
    async init () {
        await super.init();

        this.vue.use( Router );

        // components requires .toString() method,
        // because ext is trying to convert component to string when component is passed as scope to .on() call
        this.vue.config.globalProperties.toString = function () {
            return null;
        };
    }

    mount ( selector ) {

        // mount to the Ext.Viewport
        super.mount( Ext.Viewport.el.dom );
    }

    // protected
    async _initViewport () {
        return new Promise( resolve => {
            Ext.application( {
                "name": "-",
                "quickTips": true,
                "app": this.app,
                "launch": () => {
                    resolve();
                },
            } );
        } );
    }
}

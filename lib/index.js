import "#ext.js";
import "#ewc.js";
import createApp from "@softvisio/vue";
import { createVNode, render } from "vue";
import( "@fortawesome/fontawesome-free/css/all.min.css" );
import Router from "./router";

export default function () {
    const app = createApp();

    app.config.globalProperties.$router = new Router();

    // XXX move to softvisio/vue
    app.config.globalProperties.$destroy = function () {
        if ( this.$.vnode.$destroy ) this.$.vnode.$destroy();
    };

    /*
     * mount(component, { props, children, element, app })
     * component: required, the component to be created/mounted
     * props: props to be passed onto the component, this can include HTML attributes like id or class
     * children: components to be rendered as children of component
     * element: if specified, the element to mount the component into, if not specified, a div will be created
     *
     * returns { vNode, destroy, el }
     * vNode: the instance of the component provided
     */
    app.mountComponent = function ( component, { props, children, element, onDestroy } = {} ) {
        let el = element;

        let vNode = createVNode( component, props, children );

        if ( app?._context ) vNode.appContext = app._context;

        if ( el ) render( vNode, el );
        else if ( typeof document !== "undefined" ) render( vNode, ( el = document.createElement( "div" ) ) );

        if ( onDestroy ) vNode.$onDestroy = onDestroy;

        vNode.$destroy = function () {
            if ( el ) render( null, el );

            if ( vNode ) {
                vNode.$destroy = null;

                const onDestroy = vNode.$onDestroy;
                vNode.$onDestroy = null;

                vNode = null;

                if ( onDestroy ) onDestroy();
            }

            el = null;
        };

        return vNode;
    };

    // components requires .toString() method, because ext is trying to convert component to string when component is passed as scope to .on() call
    app.config.globalProperties.toString = function () {
        return null;
    };

    Ext.data.proxy.Softvisio.api = app.config.globalProperties.$api;
    Ext.Container.vueApp = app;

    return app;
}

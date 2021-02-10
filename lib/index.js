import "#ext.js";
import "#ewc.js";
import createApp from "@softvisio/vue";
import( "@fortawesome/fontawesome-free/css/all.min.css" );
import Router from "./router";

export default function () {
    const app = createApp();

    app.config.globalProperties.$router = new Router();

    // XXX move to softvisio/vue
    app.config.globalProperties.$destroy = function () {
        if ( this.$.vnode.$destroy ) this.$.vnode.$destroy();
    };

    // components requires .toString() method, because ext is trying to convert component to string when component is passed as scope to .on() call
    app.config.globalProperties.toString = function () {
        return null;
    };

    Ext.data.proxy.Softvisio.api = app.config.globalProperties.$api;
    Ext.Container.vueApp = app;

    return app;
}

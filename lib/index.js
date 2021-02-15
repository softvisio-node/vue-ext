import "#ext.js";
import "#ewc.js";
import createApp from "@softvisio/vue";
import router from "./plugins/router";
import( "@fortawesome/fontawesome-free/css/all.min.css" );

export default function () {
    const app = createApp();

    app.config.isCustomElement = tag => tag.startsWith( "ext-" );

    app.use( router );

    // components requires .toString() method, because ext is trying to convert component to string when component is passed as scope to .on() call
    app.config.globalProperties.toString = function () {
        return null;
    };

    Ext.data.proxy.Softvisio.api = app.config.globalProperties.$api;

    return app;
}

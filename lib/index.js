import "#ext.js";
import "#ewc.js";
import createApp from "@softvisio/vue";
import( "@fortawesome/fontawesome-free/css/all.min.css" );
import Router from "./router";

// XXX
// Vue.config.ignoredElements = [/^ext-/];

export default function () {
    const app = createApp();

    app.config.globalProperties.$router = new Router();

    Ext.data.proxy.Softvisio.setApi( app.config.globalProperties.$api );

    return app;
}

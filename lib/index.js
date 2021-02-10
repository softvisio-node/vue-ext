import "#ext.js";
import "#ewc.js";
import createApp from "@softvisio/vue";
import( "@fortawesome/fontawesome-free/css/all.min.css" );
import Router from "./router";

export default function () {
    const app = createApp();

    app.config.isCustomElement = tag => tag.startsWith( "ext-" );

    app.config.globalProperties.$router = new Router();

    Ext.data.proxy.Softvisio.setApi( app.config.globalProperties.$api );

    return app;
}

import "#ext.js";
import "#ewc.js";
import createApp from "@softvisio/vue";
import( "@fortawesome/fontawesome-free/css/all.min.css" );
import Router from "./router";

export default function () {
    const app = createApp();

    app.config.globalProperties.$router = new Router();

    Ext.data.proxy.Softvisio.api = app.config.globalProperties.$api;
    Ext.Container.vueApp = app;

    return app;
}

import Vue from "vue";
import "#ext.js";
import "#ewc.js";
import create from "@softvisio/vue";
import( "@fortawesome/fontawesome-free/css/all.min.css" );
import Router from "./router";

Vue.config.ignoredElements = [/^ext-/];

const router = new Router();
Vue.prototype.$router = router;

Ext.data.proxy.Softvisio.setApi( Vue.prototype.$api );

export default create;

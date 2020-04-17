import Vue from "vue";
import "#ext.js";
import "#ewc.js";
import init from "@softvisio/vue/lib/app";
import( "@fortawesome/fontawesome-free/css/all.min.css" );
import { toast } from "./util";
import Router from "./router";

Vue.config.ignoredElements = [/^ext-/];

const router = new Router();
Vue.prototype.$router = router;

Ext.data.proxy.Softvisio.setApi( Vue.prototype.$api );

// global toast
Vue.prototype.$toast = toast;

export default init;

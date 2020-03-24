import Vue from "vue";
import "#ext.js";
import "#ewc.js";
import( "@fortawesome/fontawesome-free/css/all.min.css" );
import Api from "@softvisio/core/lib/api";
import { dialog, toast } from "#swc/util";
import store from "@/store";
import Router from "#swc/router";
import Viewport from "@/viewport.vue";

Vue.config.productionTip = false;
Vue.config.ignoredElements = [/^ext-/];

const router = new Router();
Vue.prototype.$router = router;

const api = new Api( {
    "url": process.env.VUE_APP_API_URL,
} );

Vue.prototype.$api = api;
Ext.data.proxy.Softvisio.setApi( api );

// global event bus
Vue.prototype.$global = new Vue();

// global toast
Vue.prototype.$toast = toast;

// global dialog
Vue.prototype.$dialog = dialog;

// TODO why I shoild do this manually?
Vue.prototype.$store = store;

store.dispatch( "session/init" );

const App = new Vue( {
    store,
    "render": ( h ) => h( Viewport ),
} ).$mount( "#app" );

export default App;

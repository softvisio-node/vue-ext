import Vue from "vue";
import Viewport from "@/viewport.vue";
import store from "@/store";
import Api from "@softvisio/core/lib/api";
import Ext from "#ext"; // ExtJS
import( "@fortawesome/fontawesome-free/css/all.min.css" );

// import common ExtJS components
import( "#ewc/ext-container.component" );
import( "#ewc/ext-panel.component" );
import( "#ewc/ext-dialog.component" );
import( "#ewc/ext-spacer.component" );
import( "#ewc/ext-toolbar.component" );
import( "#ewc/ext-button.component" );
import( "#ewc/ext-formpanel.component" );
import( "#ewc/ext-fieldpanel.component" );
import( "#ewc/ext-textfield.component" );
import( "#ewc/ext-passwordfield.component" );

Vue.config.productionTip = false;
Vue.config.ignoredElements = [/^ext-/];

const api = new Api( {
    "url": process.env.VUE_APP_API_URL,
} );

Vue.prototype.$api = api;
Ext.data.proxy.Softvisio.setApi( api );

// global event bus
Vue.prototype.$global = new Vue();

// global toast
Vue.prototype.$toast = function ( msg, timeout ) {
    if ( !timeout ) timeout = 3000;

    if ( Ext.isObject( msg ) ) {
        if ( msg.reason ) {
            msg = msg.reason;
        }
        else if ( msg.toString ) {
            msg = msg.toString();
        }
    }

    Ext.toast( msg, timeout );
};

// TODO why I shoild do this manually?
Vue.prototype.$store = store;

store.dispatch( "session/init" );

const App = new Vue( {
    store,
    "render": ( h ) => h( Viewport ),
} ).$mount( "#app" );

export default App;

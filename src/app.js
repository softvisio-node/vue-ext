import "#vue/locale";

await import( /* webpackMode: "eager" */ "#ext" );
await import( /* webpackMode: "eager" */ "#ewc" );
import( "#src/store/theme" );
import( /* webpackChunkName: "fa" */ "@fortawesome/fontawesome-free/css/all.min.css" );
import AuthorizationDialog from "#src/components/authorization.dialog";

const _App = ( await import( /* webpackMode: "eager" */ "@softvisio/vue/app" ) ).default;
const Router = ( await import( /* webpackMode: "eager" */ "#src/router" ) ).default;

export default class App extends _App {

    // public
    async init () {
        await super.init();

        this.vue.use( Router );

        // components requires .toString() method, because ext is trying to convert component to string when component is passed as scope to .on() call
        this.vue.config.globalProperties.toString = function () {
            return null;
        };
    }

    mount ( selector ) {

        // mount to the Ext.Viewport
        super.mount( Ext.Viewport.el.dom );
    }

    async signout () {

        // mask viewport immidiately, this is required, when api is not connected
        Ext.Viewport.mask();

        return super.signout();
    }

    // protected
    async _initViewport () {
        return new Promise( resolve => {
            Ext.application( {
                "name": "-",
                "quickTips": true,
                "app": this,
                "launch": () => {
                    resolve();
                },
            } );
        } );
    }

    async _onConnectionError ( res ) {
        if ( res ) this.utils.toast( res );

        return this.utils.alert( window.i18nd( `vue-ext`, `Unable to connect to the API server. Check, that you have internet connection.` ), {
            "title": window.i18nd( `vue-ext`, `Connection error` ),
        } );
    }

    async _onSignout ( res ) {
        if ( res ) this.utils.toast( res );

        await this.utils.alert( window.i18nd( `vue-ext`, `Your session was terminated on the API server.` ), {
            "title": window.i18nd( `vue-ext`, `Session closed` ),
        } );

        Ext.Viewport.mask();
    }

    async _onAuthorization () {
        const cmp = await this.vue.$mount( AuthorizationDialog );

        return cmp.show();
    }
}

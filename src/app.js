import "#vue/locale";
import VueApp from "@softvisio/vue/app";
import Router from "#src/app/router";
import AuthorizationDialog from "#src/components/authorization.dialog";
import Theme from "#src/app/theme";

export default class VueExtApp extends VueApp {
    #theme;
    #router;

    // properties
    get theme () {
        return this.#theme;
    }

    get router () {
        return this.#router;
    }

    // public
    async init () {
        this.#theme = new Theme( this );

        this.#router = new Router( this );

        return super.init();
    }

    async signout () {

        // mask viewport immidiately, this is required, when api is not connected
        Ext.Viewport.mask();

        return super.signout();
    }

    // protected
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

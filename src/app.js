import VueApp from "@softvisio/vue/app";
import Router from "#src/app/router";
import AuthorizationDialog from "#src/components/authorization.dialog";

export default class VueExtApp extends VueApp {
    #router;

    // properties
    get router () {
        return this.#router;
    }

    // public
    async init () {
        this.#router = new Router( this );

        return super.init();
    }

    async signOut () {

        // mask viewport immidiately, this is required, when api is not connected
        Ext.Viewport.mask();

        return super.signOut();
    }

    // protected
    async _onConnectionError ( res ) {
        if ( res ) this.utils.toast( res );

        return this.utils.alert( window.l10n( `Unable to connect to the API server. Check, that you have internet connection.`, { "domain": `vue-ext` } ), {
            "title": window.l10n( `Connection error`, { "domain": `vue-ext` } ),
        } );
    }

    async _onSignout ( res ) {
        if ( res ) this.utils.toast( res );

        await this.utils.alert( window.l10n( `Your session was terminated on the API server.`, { "domain": `vue-ext` } ), {
            "title": window.l10n( `Session closed`, { "domain": `vue-ext` } ),
        } );

        Ext.Viewport.mask();
    }

    async _onAuthorization () {
        const cmp = await this.viewport.vue.$mount( AuthorizationDialog );

        return cmp.show();
    }
}

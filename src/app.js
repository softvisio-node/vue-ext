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

        return this.utils.alert( window.l10n( `Unable to connect to the API server. Check, that you have internet connection.` ), {
            "title": window.l10n( `Connection error` ),
        } );
    }

    async _onSignout ( res ) {
        if ( res ) this.utils.toast( res );

        await this.utils.alert( window.l10n( `Your session was terminated on the API server.` ), {
            "title": window.l10n( `Session closed` ),
        } );

        Ext.Viewport.mask();
    }

    async _onAuthorization () {
        const cmp = await this.viewport.vue.$mount( AuthorizationDialog );

        return cmp.show();
    }

    async _onInsufficientPermissions () {
        const res = await this.utils.confirm( window.l10n( `Your access permissions were changed on API server. Please, reload application to apply updates.` ), {
            "title": window.l10n( `Insufficient permissions` ),
            "iconCls": "fa-solid fa-triangle-exclamation",
            "okText": window.l10n( "Reload" ),
        } );

        if ( res ) {
            Ext.Viewport.mask();

            return this.reload();
        }
    }
}

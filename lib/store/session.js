import _SessionStore from "@softvisio/vue/store/session";

export default class SessionStore extends _SessionStore {
    #isInitialized;

    async _init () {
        await super._init();

        if ( this.#isInitialized ) return;

        this.#isInitialized = true;

        this.$api.on( "close", res => {
            if ( res.status === 1100 ) this.$utils.toast( `You were signed out` );
        } );
    }
}

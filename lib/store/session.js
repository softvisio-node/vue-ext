import _SessionStore from "@softvisio/vue/store/session";

export default class SessionStore extends _SessionStore {
    constructoe () {
        super();

        this.$api.on( "signout", () => this.$utils.toast( `You were signed out` ) );
    }
}

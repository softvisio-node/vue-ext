import _SessionStore from "@softvisio/vue/store/session";

export default class SessionStore extends _SessionStore {
    constructor () {
        super();

        this.$app.on( "api/signout", () => this.$utils.toast( `You were signed out` ) );
    }
}

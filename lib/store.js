import BaseStore from "@softvisio/vue/store";
import SessionStore from "./store/session";
import ThemeStore from "./store/theme";
import ApiTokensStore from "./store/api-tokens";
import UsersStore from "./store/users";

export default class VueExtStore extends BaseStore {
    static install ( app, options, store ) {
        if ( !store ) store = new ( class Store extends this {} )();

        store.session ||= SessionStore;
        store.theme ||= ThemeStore;
        store["api-tokens"] ||= ApiTokensStore;
        store.users ||= UsersStore;

        super.install( app, options, store );
    }
}

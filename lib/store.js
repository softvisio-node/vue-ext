import BaseStore from "@softvisio/vue/store";
import SessionStore from "./store/session";
import ThemeStore from "./store/theme";
import ApiTokensStore from "./store/api-tokens";
import UsersStore from "./store/users";
import NotificationsStore from "./store/notifications";

export default class VueExtStore extends BaseStore {
    static install ( app, options = {} ) {
        if ( !options.store ) options.store = new ( class Store extends this {} )();

        options.store.session ||= SessionStore;
        options.store.theme ||= ThemeStore;
        options.store["api-tokens"] ||= ApiTokensStore;
        options.store.users ||= UsersStore;
        options.store.notifications ||= NotificationsStore;

        super.install( app, options );
    }
}

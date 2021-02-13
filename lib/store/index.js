import BaseStore from "@softvisio/vue/store";
import SessionStore from "./session";
import SettingsStore from "./settings";
import ThemeStore from "./theme";
import ApiTokensStore from "./api-tokens";
import UsersStore from "./users";

export default class VueExtStore extends BaseStore {
    static install ( app, options, store ) {
        if ( !store ) store = new ( class Store extends this {} )();

        store.session ||= SessionStore;
        store.settings ||= SettingsStore;
        store.theme ||= ThemeStore;
        store["api-tokens"] ||= ApiTokensStore;
        store.users ||= UsersStore;

        super.install( app, options, store );
    }
}

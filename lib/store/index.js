import BaseStore from "@softvisio/vue/store";
import SessionStore from "./session";
import SettingsStore from "./settings";
import ThemeStore from "./theme";
import ApiTokensStore from "./api-tokens";
import UsersStore from "./users";

export default class Store extends BaseStore {
    static install ( app, options, store ) {
        if ( !store ) {
            const Class = class extends this {
                $root = this;
                $parent = this;
            };

            store = new Class( options );
        }

        store.session ||= SessionStore;
        store.settings ||= SettingsStore;
        store.theme ||= ThemeStore;
        store["api-tokens"] ||= ApiTokensStore;
        store.users ||= UsersStore;

        super.install( app, options, store );
    }
}

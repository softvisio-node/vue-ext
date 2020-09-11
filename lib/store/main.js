import Store from "@softvisio/vue/store/main";
import Theme from "./theme";
import ApiTokens from "./api-tokens";
import Users from "./users";

export default class extends Store {
    modules () {
        var cfg = super.modules() || {};

        if ( !cfg.theme && cfg.theme !== false ) cfg.theme = Theme;

        if ( !cfg["api-tokens"] && cfg["api-tokens"] !== false ) cfg["api-tokens"] = ApiTokens;

        if ( !cfg.users && cfg.users !== false ) cfg.users = Users;

        return cfg;
    }
}

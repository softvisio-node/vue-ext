import Store from "@softvisio/vue/store/main";
import Theme from "./theme";
import ApiTokens from "./api-tokens";
import Users from "./users";

export default class extends Store {
    constructor () {
        super();

        if ( !( "theme" in this ) ) this.theme = Theme;

        if ( !( "api-tokens" in this ) ) this["api-tokens"] = ApiTokens;

        if ( !( "users" in this ) ) this.users = Users;
    }
}

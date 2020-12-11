import Store from "@softvisio/vue/store/main";
import Theme from "./theme";
import ApiTokens from "./api-tokens";
import Users from "./users";

export default class extends Store {
    constructor () {
        super();

        if ( !this.theme ) this.theme = Theme;

        if ( !this["api-tokens"] ) this["api-tokens"] = ApiTokens;

        if ( !this.users ) this.users = Users;
    }
}

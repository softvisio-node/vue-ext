import Main from "@softvisio/vue/store/main";
import Theme from "./theme";
import ApiTokens from "./api-tokens";
import Users from "./users";

export default class extends Main {
    get MODULES () {
        return {
            "theme": Theme,
            "api-tokens": ApiTokens,
            "users": Users,
            ...super.MODULES,
        };
    }
}

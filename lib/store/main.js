import Store from ".";
import SessionStore from "./session";
import ThemeStore from "./theme";
import ApiTokensStore from "./api-tokens";
import UsersStore from "./users";
import SettingsStore from "./settings";

export default class extends Store {
    session = SessionStore;
    theme = ThemeStore;
    ["api-tokens"] = ApiTokensStore;
    users = UsersStore;
    settings = SettingsStore;
}

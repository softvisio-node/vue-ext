import Store from "@softvisio/vue/store";
import SessionStore from "#store/session";
import ThemeStore from "#store/theme";
import ApiTokensStore from "#store/api-tokens";
import UsersStore from "#store/users";
import NotificationsStore from "#store/notifications";

export default class VueExtStore extends Store {
    initMainStore () {
        this.session ||= SessionStore.new();
        this.theme ||= ThemeStore.new();
        this["api-tokens"] ||= ApiTokensStore.new();
        this.users ||= UsersStore.new();
        this.notifications ||= NotificationsStore.new();

        super.initMainStore();
    }
}

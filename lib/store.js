import Store from "@softvisio/vue/store";
import SessionStore from "#lib/store/session";
import ThemeStore from "#lib/store/theme";
import NotificationsStore from "#lib/store/notifications";

export default class VueExtStore extends Store {
    initMainStore () {
        this.session ||= SessionStore.new();
        this.theme ||= ThemeStore.new();
        this.notifications ||= NotificationsStore.new();

        super.initMainStore();
    }
}

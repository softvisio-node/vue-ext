import Store from "@softvisio/vue/store";
import ThemeStore from "#src/store/theme";
import NotificationsStore from "#src/store/notifications";

export default class VueExtStore extends Store {
    initMainStore () {
        this.theme ||= ThemeStore.new();
        this.notifications ||= NotificationsStore.new();

        super.initMainStore();
    }
}

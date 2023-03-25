import Store from "@softvisio/vue/store";
import NotificationsStore from "#src/store/notifications";

export default class VueExtStore extends Store {
    initMainStore () {
        this.notifications ||= NotificationsStore.new();

        super.initMainStore();
    }
}

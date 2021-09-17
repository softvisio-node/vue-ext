import _NotificationsStore from "@softvisio/vue/store/notifications";
import NotificationModel from "../models/notification";

export default class NotificationsStore extends _NotificationsStore {
    #store;

    // properties
    get model () {
        return NotificationModel;
    }

    get store () {
        if ( !this.#store ) {
            this.#store = Ext.create( "Ext.data.Store", {
                "model": this.model,
                "autoLoad": false,
                "pageSize": 50,
            } );
        }

        return this.#store;
    }

    // protected
    _onNotificationsUpdated () {}
}

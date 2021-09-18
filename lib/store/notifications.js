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

    // public
    refreshRelativeTime () {
        this.store.each( record => record.set( "relative_time", this._getRelativeTime( record.get( "date" ) ) ) );
    }

    // protected
    _onNotificationsUpdated ( data ) {
        this.store.loadRawData( data );

        let newNotifications = 0;

        this.store.each( record => {
            if ( !record.get( "read" ) ) newNotifications++;
        } );

        this.newNotifications = newNotifications;
    }
}

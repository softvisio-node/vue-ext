import _NotificationsStore from "@softvisio/vue/store/notifications";
import NotificationModel from "../models/notification";
import Mutex from "#core/threads/mutex";

export default class NotificationsStore extends _NotificationsStore {
    #store;
    #mutex = new Mutex();

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

    refreshUnreadCount () {
        let unreadCount = 0;

        this.store.each( record => {
            if ( !record.get( "read" ) ) unreadCount++;
        } );

        this.unreadCount = unreadCount;
    }

    async markAllRead () {
        if ( !this.#mutex.tryDown() ) return;

        const unreadNotifications = [];

        this.store.each( record => {
            if ( !record.get( "read" ) ) unreadNotifications.push( record.id );
        } );

        if ( unreadNotifications.length ) {
            const res = await this._markRead( unreadNotifications );

            if ( res.ok ) {
                unreadNotifications.forEach( id => this.store.getById( id ).set( "read", true ) );

                this.refreshUnreadCount();
            }
        }

        this.#mutex.up();
    }

    async delete ( notification ) {
        const res = await this._delete( notification );

        if ( !res.ok ) {
            this.$utils.toast( res );
        }
        else {
            this.store.remove( this.store.getById( notification ) );
        }
    }

    // protected
    _onNotificationsUpdated ( data ) {
        this.store.loadRawData( data );

        this.refreshUnreadCount();
        this.refreshRelativeTime();
    }
}

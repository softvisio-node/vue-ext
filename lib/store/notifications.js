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

    refreshCount () {
        let unreadCount = 0;

        this.store.each( record => {
            if ( !record.get( "read" ) ) unreadCount++;
        } );

        this.totalCount = this.store.count();
        this.unreadCount = unreadCount;
    }

    async markUnread ( notificationId ) {
        const record = this.store.getById( notificationId );

        if ( !record || !record.get( "read" ) ) return;

        const res = await this._markUnread( notificationId );

        if ( !res.ok ) {
            this.$utils.toast( res );
        }
        else {
            record.set( "read", false );

            this.refreshCount();
        }
    }

    async markRead ( notificationId ) {
        const record = this.store.getById( notificationId );

        if ( !record || record.get( "read" ) ) return;

        const res = await this._markRead( notificationId );

        if ( !res.ok ) {
            this.$utils.toast( res );
        }
        else {
            record.set( "read", true );

            this.refreshCount();
        }
    }

    async markAllRead () {
        if ( !this.store.count() ) return;

        if ( !this.#mutex.tryDown() ) return;

        const unreadNotifications = [];

        this.store.each( record => {
            if ( !record.get( "read" ) ) unreadNotifications.push( record.id );
        } );

        if ( unreadNotifications.length ) {
            const res = await this._markRead( unreadNotifications );

            if ( res.ok ) {
                unreadNotifications.forEach( id => this.store.getById( id ).set( "read", true ) );

                this.refreshCount();
            }
        }

        this.#mutex.up();
    }

    async delete ( notificationId ) {
        const res = await this._delete( notificationId );

        if ( !res.ok ) {
            this.$utils.toast( res );
        }
        else {
            this.store.remove( this.store.getById( notificationId ) );
        }
    }

    async deleteAll () {
        if ( !this.store.count() ) return;

        if ( !this.#mutex.tryDown() ) return;

        const notifications = [];

        this.store.each( record => notifications.push( record.id ) );

        const res = await this._delete( notifications );

        if ( res.ok ) {
            this.store.removeAll();

            this.refreshCount();

            this.$utils.toast( "Notifications deleted" );
        }
        else {
            this.$utils.toast( res );
        }

        this.#mutex.up();
    }

    // protected
    _onNotificationsUpdated ( data ) {
        this.store.loadRawData( data );

        this.refreshCount();
        this.refreshRelativeTime();
    }
}

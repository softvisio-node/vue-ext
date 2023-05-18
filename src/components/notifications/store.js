import Store from "#vue/store";
import NotificationModel from "#src/components/notifications/models/notification";
import locale from "#vue/locale";
import app from "@/app";

class NotificationsStore extends Store {
    totalInbox = 0;
    totalDone = 0;

    #app;
    #inboxStore;
    #doneStore;

    constructor ( app ) {
        super();

        this.#app = app;

        if ( this.#app.internalNotificationsEnabled ) {
            this.#app.api.on( "connect", this.refresh.bind( this ) );

            this.#app.api.on( "notifications/update", this.refresh.bind( this ) );
        }
    }

    // properties
    get app () {
        return this.#app;
    }

    get inboxStore () {
        if ( !this.#inboxStore ) {
            this.#inboxStore = Ext.create( "Ext.data.Store", {
                "model": NotificationModel,
                "autoLoad": this.#app.internalNotificationsEnabled,
                "pageSize": 25,
                "filters": [
                    {
                        "property": "done",
                        "operator": "=",
                        "value": false,
                    },
                ],
            } );

            this.#inboxStore.on( "load", this.#onLoad.bind( this, "inbox" ) );
        }

        return this.#inboxStore;
    }

    get doneStore () {
        if ( !this.#doneStore ) {
            this.#doneStore = Ext.create( "Ext.data.Store", {
                "model": NotificationModel,
                "autoLoad": this.#app.internalNotificationsEnabled,
                "pageSize": 25,
                "filters": [
                    {
                        "property": "done",
                        "operator": "=",
                        "value": true,
                    },
                ],
            } );

            this.#doneStore.on( "load", this.#onLoad.bind( this, "done" ) );
        }

        return this.#doneStore;
    }

    // public
    refresh ( { inbox, done } = {} ) {
        if ( inbox == null || inbox ) this.inboxStore.loadPage( 1 );

        if ( done == null || done ) this.doneStore.loadPage( 1 );
    }

    refreshRelativeTime () {
        this.inboxStore.each( record => record.set( "relative_time", this.#getRelativeTime( record.get( "created" ) ) ) );

        this.doneStore.each( record => record.set( "relative_time", this.#getRelativeTime( record.get( "created" ) ) ) );
    }

    async updateNotifications ( options ) {
        const res = await this.#app.api.call( "account/notifications/update", options );

        if ( !res.ok ) {
            this.#app.utils.toast( res );
        }
        else {
            this.refresh( res.data );
        }
    }

    async deleteNotification ( options ) {
        const res = await this.#app.api.call( "account/notifications/delete", options );

        if ( !res.ok ) {
            this.#app.utils.toast( res );
        }
        else {
            this.refresh( res.data );
        }
    }

    // private
    #onLoad ( type ) {
        if ( type === "inbox" ) {
            this.totalInbox = this.inboxStore.getSummaryRecord().get( "total" );

            this.inboxStore.each( record => record.set( "relative_time", this.#getRelativeTime( record.get( "created" ) ) ) );
        }
        else if ( type === "done" ) {
            this.totalDone = this.doneStore.getSummaryRecord().get( "total" );

            this.doneStore.each( record => record.set( "relative_time", this.#getRelativeTime( record.get( "created" ) ) ) );
        }
    }

    #getRelativeTime ( date ) {
        return locale.formatRelativeTime( date, "style:short" );
    }
}

export default NotificationsStore.new( "notifications", app );

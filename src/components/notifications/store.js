import VueStore from "#vue/store";
import NotificationModel from "#src/components/notifications/models/notification";
import locale from "#vue/locale";
import app from "@/app";

const api = app.api,
    utils = app.utils;

class Store extends VueStore {
    totalUndone = 0;

    #inboxStore;
    #doneStore;

    constructor () {
        super();

        api.on( "connect", this.refresh.bind( this ) );

        api.on( "notifications", this.refresh.bind( this ) );
    }

    // properties
    get inboxStore () {
        if ( !this.#inboxStore ) {
            this.#inboxStore = Ext.create( "Ext.data.Store", {
                "model": NotificationModel,
                "autoLoad": true,
                "pageSize": 25,
                "filters": [
                    {
                        "property": "done",
                        "operator": "=",
                        "value": false,
                    },
                ],
            } );

            this.#inboxStore.on( "load", this.#onLoad.bind( this, true ) );
        }

        return this.#inboxStore;
    }

    get doneStore () {
        if ( !this.#doneStore ) {
            this.#doneStore = Ext.create( "Ext.data.Store", {
                "model": NotificationModel,
                "autoLoad": true,
                "pageSize": 25,
                "filters": [
                    {
                        "property": "done",
                        "operator": "=",
                        "value": true,
                    },
                ],
            } );

            this.#doneStore.on( "load", this.#onLoad.bind( this, false ) );
        }

        return this.#doneStore;
    }

    // public
    // XXX
    refresh () {

        // XXX workaround for issue, when first lisr item clicked
        this.inboxStore.loadRawData( [] );
        this.doneStore.loadRawData( [] );

        this.inboxStore.loadPage( 1 );
        this.doneStore.loadPage( 1 );
    }

    refreshRelativeTime () {
        this.inboxStore.each( record => record.set( "relative_time", this.#getRelativeTime( record.get( "created" ) ) ) );

        this.doneStore.each( record => record.set( "relative_time", this.#getRelativeTime( record.get( "created" ) ) ) );
    }

    async updateNotification ( notificationId, options ) {
        const res = await api.call( "account/notifications/update", notificationId, options );

        if ( !res.ok ) {
            utils.toast( res );
        }
        else {
            this.refresh();
        }
    }

    async updateAllNotifications ( options ) {
        const res = await api.call( "account/notifications/update-all", options );

        if ( !res.ok ) {
            utils.toast( res );
        }
        else {
            this.refresh();
        }
    }

    async deleteNotification ( options ) {
        const res = await api.call( "account/notifications/delete", options );

        if ( !res.ok ) {
            utils.toast( res );
        }
        else {
            this.refresh();
        }
    }

    // private
    #onLoad ( inbox ) {
        this.refreshRelativeTime();

        if ( inbox ) {
            this.totalUndone = this.inboxStore.getSummaryRecord().get( "total" );
        }
    }

    #getRelativeTime ( date ) {
        return locale.formatRelativeTime( date, "style:short" );
    }
}

export default Store.new( "notifications" );

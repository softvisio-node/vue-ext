import VueStore from "#vue/store";
import NotificationModel from "#src/components/notifications/models/notification";
import locale from "#vue/locale";
import app from "@/app";

const api = app.api,
    utils = app.utils;

class Store extends VueStore {
    totalInbox = 0;
    totalDone = 0;

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

            this.#inboxStore.on( "load", this.#onLoad.bind( this, "inbox" ) );
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

            this.#doneStore.on( "load", this.#onLoad.bind( this, "done" ) );
        }

        return this.#doneStore;
    }

    // public
    refresh () {
        this.inboxStore.loadPage( 1 );
        this.doneStore.loadPage( 1 );
    }

    refreshRelativeTime () {
        this.inboxStore.each( record => record.set( "relative_time", this.#getRelativeTime( record.get( "created" ) ) ) );

        this.doneStore.each( record => record.set( "relative_time", this.#getRelativeTime( record.get( "created" ) ) ) );
    }

    async updateNotifications ( options ) {
        const res = await api.call( "account/notifications/update", options );

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

export default Store.new( "notifications" );

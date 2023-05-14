import VueStore from "#vue/store";
import NotificationModel from "#src/components/notifications/models/notification";
import locale from "#vue/locale";
import app from "@/app";

const api = app.api,
    utils = app.utils;

class Store extends VueStore {
    totalUndone = 0;
    totalUndoneUnread = 0;

    #store;
    #storeLoaded;

    #doneStore;

    constructor () {
        super();

        api.on( "connect", () => {
            if ( !this.#storeLoaded ) return;

            this.reload();
        } );

        api.on( "notifications", this.reload.bind( this ) );
    }

    // properties
    get model () {
        return NotificationModel;
    }

    get store () {
        if ( !this.#store ) {
            this.#store = Ext.create( "Ext.data.Store", {
                "model": this.model,
                "autoLoad": false,
                "pageSize": 25,
                "filters": [
                    {
                        "property": "done",
                        "operator": "=",
                        "value": false,
                    },
                ],
            } );

            this.#store.on( "load", this.#onLoad.bind( this ) );
        }

        return this.#store;
    }

    get doneStore () {
        if ( !this.#doneStore ) {
            this.#doneStore = Ext.create( "Ext.data.Store", {
                "model": this.model,
                "autoLoad": false,
                "pageSize": 25,
                "filters": [
                    {
                        "property": "done",
                        "operator": "=",
                        "value": true,
                    },
                ],
            } );

            this.#doneStore.on( "load", this.#onLoad.bind( this ) );
        }

        return this.#doneStore;
    }

    // public
    reload () {
        this.store.loadPage( 1 );
    }

    refreshRelativeTime () {
        this.store.each( record => record.set( "relative_time", this.#getRelativeTime( record.get( "created" ) ) ) );
    }

    async updateNotification ( notificationId, options ) {
        const res = await api.call( "account/notifications/update", notificationId, options );

        if ( !res.ok ) {
            utils.toast( res );
        }
        else {
            this.#applyStats( res.meta );

            this.reload();
        }
    }

    async updateAllNotifications ( options ) {
        const res = await api.call( "account/notifications/update-all", options );

        if ( !res.ok ) {
            utils.toast( res );
        }
        else {
            this.#applyStats( res.meta );

            this.reload();
        }
    }

    async deleteNotification ( options ) {
        const res = await api.call( "account/notifications/delete", options );

        if ( !res.ok ) {
            utils.toast( res );
        }
        else {
            this.#applyStats( res.meta );

            this.reload();
        }
    }

    // private
    #onLoad () {
        this.#storeLoaded = true;

        this.refreshRelativeTime();

        this.totalUndone = this.store.getSummaryRecord().get( "total" );
        this.totalUndoneUnread = this.store.getSummaryRecord().get( "total_undone_unread" );
    }

    #getRelativeTime ( date ) {
        return locale.formatRelativeTime( date, "style:short" );
    }

    #applyStats ( meta ) {
        if ( !meta.stats ) return;

        this.totalUndone = meta.stats.total_undone;
        this.totalUndoneUnread = meta.stats.total_undone_unread;
    }
}

export default Store.new( "notifications" );

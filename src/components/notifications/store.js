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

    // public
    reload () {
        this.store.loadPage( 1 );
    }

    refreshRelativeTime () {
        this.store.each( record => record.set( "relative_time", this.#getRelativeTime( record.get( "created" ) ) ) );
    }

    async setRead ( notifications ) {
        if ( !Array.isArray( notifications ) ) notifications = [notifications];

        const res = await api.call( "account/notifications/set-read", notifications );

        if ( !res.ok ) {
            utils.toast( res );
        }
        else {
            this.#applyStats( res.meta );

            for ( const id of notifications ) {
                const record = this.store.getById( id );

                if ( record ) record.set( "read", true );
            }
        }
    }

    async setReadAll () {
        const res = await api.call( "account/notifications/set-read-all" );

        if ( !res.ok ) {
            utils.toast( res );
        }
        else {
            this.#applyStats( res.meta );

            this.store.each( record => record.set( "read", true ) );
        }
    }

    async setUnread ( notifications ) {
        if ( !Array.isArray( notifications ) ) notifications = [notifications];

        const res = await api.call( "account/notifications/set-unread", notifications );

        if ( !res.ok ) {
            utils.toast( res );
        }
        else {
            this.#applyStats( res.meta );

            for ( const id of notifications ) {
                const record = this.store.getById( id );

                if ( record ) record.set( "read", false );
            }
        }
    }

    async setUnreadAll () {
        const res = await api.call( "account/notifications/set-unread-all" );

        if ( !res.ok ) {
            utils.toast( res );
        }
        else {
            this.#applyStats( res.meta );

            this.store.each( record => record.set( "read", false ) );
        }
    }

    async setDone ( notifications ) {
        if ( !Array.isArray( notifications ) ) notifications = [notifications];

        const res = await api.call( "account/notifications/set-done", notifications );

        if ( !res.ok ) {
            utils.toast( res );
        }
        else {
            this.#applyStats( res.meta );

            this.reload();

            // for ( const id of notifications ) {
            //     const record = this.store.getById( id );

            //     if ( record ) this.store.remove( record );
            // }
        }
    }

    async setDoneAll () {
        if ( !this.totalUndone ) return;

        const res = await api.call( "account/notifications/set-done-all" );

        if ( !res.ok ) {
            utils.toast( res );
        }
        else {
            this.#applyStats( res.meta );

            this.reload();
        }
    }

    async setUndone ( notifications ) {
        if ( !Array.isArray( notifications ) ) notifications = [notifications];

        const res = await api.call( "account/notifications/set-undone", notifications );

        if ( !res.ok ) {
            utils.toast( res );
        }
        else {
            this.#applyStats( res.meta );

            for ( const id of notifications ) {
                const record = this.store.getById( id );

                if ( record ) record.set( "done", false );
            }
        }
    }

    async setUndoneAll () {
        const res = await api.call( "account/notifications/set-undone-all" );

        if ( !res.ok ) {
            utils.toast( res );
        }
        else {
            this.#applyStats( res.meta );

            this.store.each( record => record.set( "done", false ) );
        }
    }

    async delete ( notifications ) {
        if ( !Array.isArray( notifications ) ) notifications = [notifications];

        const res = await api.call( "account/notifications/delete", notifications );

        if ( !res.ok ) {
            utils.toast( res );
        }
        else {
            this.#applyStats( res.meta );

            for ( const id of notifications ) {
                const record = this.store.getById( id );

                if ( record ) this.store.remove( record );
            }
        }
    }

    async deleteAll () {
        const res = await api.call( "account/notifications/delete-all" );

        if ( !res.ok ) {
            utils.toast( res );
        }
        else {
            this.#applyStats( res.meta );

            this.store.each( record => this.store.remove( record ) );
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

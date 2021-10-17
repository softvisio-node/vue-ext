import Store from "@softvisio/vue/store";
import NotificationModel from "../models/notification";

export default class NotificationsStore extends Store {
    totalUndone = 0;
    totalUndoneUnread = 0;

    #store;
    #storeLoaded;

    constructor () {
        super();

        this.$api.on( "connect", () => {
            if ( !this.#storeLoaded ) return;

            this.reload();
        } );
        this.$api.on( "event/notifications", this.reload.bind( this ) );
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
    refreshRelativeTime () {
        this.store.each( record => record.set( "relative_time", this._getRelativeTime( record.get( "created" ) ) ) );
    }

    reload () {
        this.store.loadPage( 1 );
    }

    async setRead ( notifications ) {
        if ( !Array.isArray( notifications ) ) notifications = [notifications];

        const res = await this.$api.call( "notifications/set-read", notifications );

        if ( !res.ok ) {
            this.$utils.toast( res );
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
        const res = await this.$api.call( "notifications/set-read-all" );

        if ( !res.ok ) {
            this.$utils.toast( res );
        }
        else {
            this.#applyStats( res.meta );

            this.store.each( record => record.set( "read", true ) );
        }
    }

    async setUnread ( notifications ) {
        if ( !Array.isArray( notifications ) ) notifications = [notifications];

        const res = await this.$api.call( "notifications/set-unread", notifications );

        if ( !res.ok ) {
            this.$utils.toast( res );
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
        const res = await this.$api.call( "notifications/set-unread-all" );

        if ( !res.ok ) {
            this.$utils.toast( res );
        }
        else {
            this.#applyStats( res.meta );

            this.store.each( record => record.set( "read", false ) );
        }
    }

    async setDone ( notifications ) {
        if ( !Array.isArray( notifications ) ) notifications = [notifications];

        const res = await this.$api.call( "notifications/set-done", notifications );

        if ( !res.ok ) {
            this.$utils.toast( res );
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

        const res = await this.$api.call( "notifications/set-done-all" );

        if ( !res.ok ) {
            this.$utils.toast( res );
        }
        else {
            this.#applyStats( res.meta );

            this.reload();
        }
    }

    async setUndone ( notifications ) {
        if ( !Array.isArray( notifications ) ) notifications = [notifications];

        const res = await this.$api.call( "notifications/set-undone", notifications );

        if ( !res.ok ) {
            this.$utils.toast( res );
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
        const res = await this.$api.call( "notifications/set-undone-all" );

        if ( !res.ok ) {
            this.$utils.toast( res );
        }
        else {
            this.#applyStats( res.meta );

            this.store.each( record => record.set( "done", false ) );
        }
    }

    async delete ( notifications ) {
        if ( !Array.isArray( notifications ) ) notifications = [notifications];

        const res = await this.$api.call( "notifications/delete", notifications );

        if ( !res.ok ) {
            this.$utils.toast( res );
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
        const res = await this.$api.call( "notifications/delete-all" );

        if ( !res.ok ) {
            this.$utils.toast( res );
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
        this.totalUndoneUnread = this.store.getSummaryRecord().get( "totalUndoneUnread" );
    }

    _getRelativeTime ( date ) {
        return this.$utils.relativeTime( date - new Date() );
    }

    #applyStats ( meta ) {
        if ( !meta.stats ) return;

        for ( const name in meta.stats ) this[name] = meta.stats[name];
    }
}

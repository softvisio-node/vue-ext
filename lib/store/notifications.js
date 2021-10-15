import Store from "@softvisio/vue/store";
import NotificationModel from "../models/notification";
import Mutex from "#core/threads/mutex";

export default class NotificationsStore extends Store {
    undoneCount = 0;

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
            this.reload();

            // for ( const id of notifications ) {
            //     const record = this.store.getById( id );

            //     if ( record ) record.set( "done", true );
            // }
        }
    }

    async setDoneAll () {
        if ( !this.undoneCount ) return;

        const res = await this.$api.call( "notifications/set-done-all" );

        if ( !res.ok ) {
            this.$utils.toast( res );
        }
        else {
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
            this.store.each( record => this.store.remove( record ) );
        }
    }

    // private
    #onLoad () {
        this.refreshRelativeTime();

        this.undoneCount = +this.store.getSummaryRecord().get( "total" );
    }

    _getRelativeTime ( date ) {
        return this.$utils.relativeTime( date - new Date() );
    }
}

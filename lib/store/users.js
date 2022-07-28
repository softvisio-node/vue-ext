import Store from "@softvisio/vue/store";
import UserModel from "#lib/models/user";

export default class extends Store {
    #store;

    get model () {
        return UserModel;
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

    reload () {
        this.store.loadPage( 1 );
    }
}

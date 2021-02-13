import Store from "@softvisio/vue/store";
import ApiTokenModel from "../models/api-token";

export default class extends Store {
    #store;

    get model () {
        return ApiTokenModel;
    }

    get store () {
        if ( !this.#store ) {
            this.#store = Ext.create( "Ext.data.Store", {
                "model": this.model,
                "autoLoad": false,
                "pageSize": 100,
            } );
        }

        return this.#store;
    }

    reload () {
        this.store.loadPage( 1 );
    }
}

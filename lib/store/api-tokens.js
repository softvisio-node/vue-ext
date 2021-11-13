import Store from "@softvisio/vue/store";
import ApiTokenModel from "#models/api-token";

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
            } );
        }

        return this.#store;
    }

    async reload () {
        const res = await this.$api.call( "api-tokens/get-api-tokens" );

        if ( !res.ok ) {
            this.$utils.toast( res );
        }
        else {
            this.store.loadRawData( res.data );
        }
    }
}

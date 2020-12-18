import Store from ".";
import ElectronUpdateModel from "../models/electron-update";

export default class extends Store {
    #store;

    get model () {
        return ElectronUpdateModel;
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

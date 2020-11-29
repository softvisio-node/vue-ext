import Store from ".";
import ApiTokenModel from "#softvisio/models/api-token";

export default class extends Store {

    // PROTECTED
    _store = Ext.create( "Ext.data.Store", {
        "model": ApiTokenModel,
        "autoLoad": false,
        "pageSize": 100,
    } );

    // GETTERS
    GET_store ( state ) {
        return this._store;
    }
}

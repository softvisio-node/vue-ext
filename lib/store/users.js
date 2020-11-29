import Store from ".";
import UserModel from "@/models/user";

export default class extends Store {

    // PROTECTED
    _store = Ext.create( "Ext.data.Store", {
        "model": UserModel,
        "autoLoad": false,
        "pageSize": 50,
    } );

    // GETTERS
    GET_store ( state ) {
        return this._store;
    }
}

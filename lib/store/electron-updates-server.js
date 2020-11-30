import Store from ".";
import ElectronUpdateModel from "../models/electron-update";

export default class extends Store {

    // PROTECTED
    _store = Ext.create( "Ext.data.Store", {
        "model": ElectronUpdateModel,
        "autoLoad": false,
        "pageSize": 50,
    } );

    // GETTERS
    GET_store ( state ) {
        return this._store;
    }
}

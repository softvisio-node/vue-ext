import Store from ".";
import ApiTokenModel from "#softvisio/models/api-token";

export default class extends Store {

    // STATE
    store = Ext.create( "Ext.data.Store", {
        "model": ApiTokenModel,
        "autoLoad": false,
        "pageSize": 100,
    } );
}

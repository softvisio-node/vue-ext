import Store from "#softvisio/store";
import ApiTokenModel from "#softvisio/models/api-token";

export default class extends Store {
    state () {
        return {
            "store": Ext.create( "Ext.data.Store", {
                "model": ApiTokenModel,
                "autoLoad": false,
                "pageSize": 100,
            } ),
        };
    }
}

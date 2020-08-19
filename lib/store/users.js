import Store from "#softvisio/store";
import UserModel from "@/models/user";

export default class extends Store {
    state () {
        return {
            "store": Ext.create( "Ext.data.Store", {
                "model": UserModel,
                "autoLoad": false,
                "pageSize": 50,
            } ),
        };
    }
}

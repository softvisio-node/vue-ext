import Store from ".";
import UserModel from "@/models/user";

Ext.regStore( "users", {
    "model": UserModel,
    "autoLoad": false,
    "pageSize": 50,
} );

export default class extends Store {
    get store () {
        return Ext.getStore( "users" );
    }

    reload () {
        this.store.loadPage( 1 );
    }
}

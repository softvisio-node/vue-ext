import Store from ".";
import UserModel from "@/models/user";

Ext.regStore( "users", {
    "model": UserModel,
    "autoLoad": false,
    "pageSize": 50,
} );

export default class extends Store {
    reload () {
        Ext.getStore( "users" ).loadPage( 1 );
    }
}

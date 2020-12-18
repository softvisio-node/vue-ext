import Store from ".";
import UserModel from "../models/user";

export default class extends Store {
    get model () {
        return UserModel;
    }

    get store () {
        if ( !Ext.getStore( "users" ) ) {
            Ext.regStore( "users", {
                "model": this.model,
                "autoLoad": false,
                "pageSize": 50,
            } );
        }

        return Ext.getStore( "users" );
    }

    reload () {
        this.store.loadPage( 1 );
    }
}

import Store from ".";
import ApiTokenModel from "../models/api-token";

export default class extends Store {
    get model () {
        return ApiTokenModel;
    }

    get store () {
        if ( !Ext.getStore( "api-tokens" ) ) {
            Ext.regStore( "api-tokens", {
                "model": this.model,
                "autoLoad": false,
                "pageSize": 100,
            } );
        }

        return Ext.getStore( "api-tokens" );
    }

    reload () {
        this.store.loadPage( 1 );
    }
}

import Store from ".";
import ApiTokenModel from "../models/api-token";

Ext.regStore( "api-tokens", {
    "model": ApiTokenModel,
    "autoLoad": false,
    "pageSize": 100,
} );

export default class extends Store {
    reload () {
        Ext.getStore( "api-tokens" ).loadPage( 1 );
    }
}

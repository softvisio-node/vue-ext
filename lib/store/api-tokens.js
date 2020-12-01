import Store from ".";
import ApiTokenModel from "#softvisio/models/api-token";

Ext.regStore( "api-tokens", {
    "model": ApiTokenModel,
    "autoLoad": false,
    "pageSize": 100,
} );

export default class extends Store {}

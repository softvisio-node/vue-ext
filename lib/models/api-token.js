export default Ext.define( "", {
    "extend": "Ext.data.Model",

    "proxy": {
        "api": {
            "create": "api-tokens/create",

            // "read": "api-tokens/get-api-tokens",
            "update": "api-tokens/update",
            "destroy": "api-tokens/delete",
        },
    },

    "fields": [
        { "name": "id", "type": "string" },

        //
        "name",
        { "name": "created", "type": "date" },
        { "name": "enabled", "type": "bool" },
        "permissions",
    ],
} );

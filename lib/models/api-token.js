export default Ext.define( "", {
    "extend": "Ext.data.Model",

    "proxy": {
        "api": {
            "create": "apiTokens/create",
            "read": "apiTokens/read",
            "update": "apiTokens/update",
            "destroy": "apiTokens/delete",
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

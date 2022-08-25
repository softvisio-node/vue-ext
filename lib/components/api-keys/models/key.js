export default Ext.define( "", {
    "extend": "Ext.data.Model",

    "proxy": {
        "api": {
            "create": "account/api-keys/create",
            "read": "account/api-keys/read",
            "update": "account/api-keys/update",
            "destroy": "account/api-keys/delete",
        },
    },

    "fields": [
        { "name": "id", "type": "string" },

        //
        "name",
        { "name": "created", "type": "date" },
        { "name": "enabled", "type": "bool" },
        "roles",
    ],
} );

export default Ext.define( "", {
    "extend": "Ext.data.Model",

    "proxy": {
        "api": {
            "create": "api-tokens/create",
            "read": "api-tokens/read",
            "update": "api-tokens/update",
            "destroy": "api-tokens/delete",
        },
    },

    "fields": [
        "id",

        //
        "name",
        { "name": "created", "type": "date" },
        { "name": "enabled", "type": "bool" },
        "permissions",
    ],
} );

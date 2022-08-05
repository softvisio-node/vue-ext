export default Ext.define( "", {
    "extend": "Ext.data.Model",

    "proxy": {
        "api": {
            "create": "account/token/create",
            "read": "account/token/read",
            "update": "account/token/update",
            "destroy": "account/token/delete",
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

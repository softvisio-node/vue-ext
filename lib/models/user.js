export default Ext.define( "", {
    "extend": "Ext.data.Model",

    "proxy": {
        "api": {
            "create": "admin/users/create",
            "read": "admin/users/read",
            "update": "admin/users/update",
            "destroy": "admin/users/delete",
        },
    },

    "fields": [
        { "name": "id", "type": "string" },

        //
        { "name": "created", "type": "date" },
        "name",
        { "name": "enabled", "type": "bool" },
        "email",
        { "name": "emailConfirmed", "type": "bool" },
        "gravatar",
        "telegramName",
        "avatar",
        "permissions",
    ],
} );

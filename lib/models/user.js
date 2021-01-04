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
        { "name": "id", "type": "bigint" },

        //
        { "name": "created", "type": "date" },
        "name",
        { "name": "enabled", "type": "bool" },
        "email",
        { "name": "email_confirmed", "type": "bool" },
        "gravatar",
        "telegram_name",
        "avatar",
        "permissions",
    ],
} );

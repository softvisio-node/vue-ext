export default Ext.define( "", {
    "extend": "Ext.data.Model",

    "proxy": {
        "api": {
            "create": "admin/user/create",
            "read": "admin/user/read",
            "update": "admin/user/update",
            "destroy": "admin/user/delete",
        },
    },

    "fields": [
        { "name": "id", "type": "string" },

        //
        { "name": "created", "type": "date" },
        "name",
        { "name": "enabled", "type": "bool" },
        "email",
        { "name": "email_confirmed", "type": "bool" },
        "gravatar",
        "telegram_username",
        "avatar",
        "roles",
    ],
} );

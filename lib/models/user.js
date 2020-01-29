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
        "id",

        //
        "guid",
        { "name": "created", "type": "date" },
        "name",
        { "name": "enabled", "type": "bool" },
        "email",
        { "name": "email_confirmed", "type": "bool" },
        "gravatar",
        "locale",
        "telegram_name",
        "avatar",
    ],
} );

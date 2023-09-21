// import app from "#app";

export default Ext.define( "", {
    "extend": "Ext.data.Model",

    "proxy": {
        "api": {
            "read": "telegram/bots/users/get-users-list",
        },
    },

    "fields": [
        { "name": "id", "type": "string" },

        // fields
        { "name": "is_bot", "type": "bool" },
        "username",
        "first_name",
        "last_name",
        "phone",
        { "name": "created", "type": "date" },
        { "name": "last_activity", "type": "date" },
        { "name": "subscribed", "type": "bool" },
        { "name": "returned", "type": "bool" },
        { "name": "banned", "type": "bool" },
    ],
} );

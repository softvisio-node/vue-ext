export default Ext.define( "", {
    "extend": "Ext.data.Model",

    "proxy": {
        "api": {
            "read": "telegram/bots/links/read",
        },
    },

    "fields": [
        { "name": "id", "type": "string" },

        // fields
        "name",
        "description",
        "url",
        { "name": "created", "type": "date" },
        { "name": "last_user_created", "type": "date" },

        "total_users",
        "total_subscribed_users",
        "total_unsubscribed_users",
        "total_returned_users",
        "total_banned_users",
    ],
} );

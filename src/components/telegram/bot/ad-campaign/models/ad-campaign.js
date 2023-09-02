export default Ext.define( "", {
    "extend": "Ext.data.Model",

    "fields": [
        { "name": "id", "type": "string" },

        // fields
        "nme",
        "description",
        { "name": "created", "type": "date" },
        "callbacl",
        "telegram_bot_username",

        { "name": "last_user_created", "type": "data" },
        "total_users",
        "total_subscribed_users",
        "total_unsubscribed_users",
        "total_returned_users",
        "total_banned_users",

        // calculated
        { "name": "url", "calculate": data => `https://t.ne/${data.telegram_bot_username}?start=${data.callback}` },
    ],
} );

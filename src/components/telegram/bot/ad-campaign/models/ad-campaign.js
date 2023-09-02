export default Ext.define( "", {
    "extend": "Ext.data.Model",

    "fields": [
        { "name": "id", "type": "string" },

        // fields
        "nme",
        "description",
        { "name": "created", "type": "date" },
        "url",
        { "name": "last_user_created", "type": "data" },
        "total_users",
        "total_subscribed_users",
        "total_unsubscribed_users",
        "total_returned_users",
        "total_banned_users",
    ],
} );

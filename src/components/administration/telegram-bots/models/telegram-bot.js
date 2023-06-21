export default Ext.define( "", {
    "extend": "Ext.data.Model",

    "proxy": {
        "api": {
            "read": "administration/telegram-bots/read",
        },
    },

    "fields": [
        { "name": "id", "type": "string" },

        // fields
        "type",

        { "name": "static", "type": "bool" },
        "telegram_username",
        "telegram_first_name",
        { "name": "telegram_can_join_groups", "type": "bool" },
        { "name": "telegram_can_read_all_group_messages", "type": "bool" },
        { "name": "telegram_supports_inline_queries", "type": "bool" },
        "total_users",
        "total_subscribed_users",
        { "name": "started", "type": "bool" },
        { "name": "error", "type": "bool" },
        "error_text",

        // calculated
        {
            "name": "last_activity_text",
            calculate ( data ) {
                if ( !data.last_activity ) {
                    return "&mdash;";
                }
                else {
                    return Ext.util.Format.date( data.last_activity, "dateStyle:short,timeStyle:short" );
                }
            },
        },
    ],
} );

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
        "name",
        { "name": "telegram_can_join_groups", "type": "bool" },
        { "name": "telegram_can_read_all_group_messages", "type": "bool" },
        { "name": "telegram_supports_inline_queries", "type": "bool" },
        "total_users",
        "total_subscribed_users",
        { "name": "started", "type": "bool" },
        { "name": "error", "type": "bool" },
        "error_text",
    ],
} );

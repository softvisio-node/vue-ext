export default Ext.define( "", {
    "extend": "Ext.data.Model",

    "fields": [
        { "name": "id", "type": "string" },

        // fields
        "email",
        { "name": "email_confirmed", "type": "bool" },

        { "name": "telegram_username", "type": "string" },
        "telegram_bot_username",
        "telegram_user_id",

        // calculated
        { "name": "telegram_enabled", "calculate": data => !!data.telegram_bot_username },

        { "name": "has_telegram_username", "calculate": data => !!data.telegram_username },

        {
            "name": "telegram_bot_url",
            calculate ( data ) {
                if ( !data.telegram_bot_username ) return;

                return "https://t.me/" + data.telegram_bot_username;
            },
        },
    ],
} );

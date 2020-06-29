export default Ext.define( "", {
    "extend": "Ext.data.Model",
    "proxy": {
        "api": {
            "read": "admin/settings/read",
            "update": "admin/settings/update",
        },
    },
    "fields": [
        "id",

        //
        { "name": "app_url", "type": "string" },

        // SMTP
        { "name": "smtp_host", "validators": "presence" },
        { "name": "smtp_port", "validators": ["presence", { "type": "range", "min": 1, "max": 65535 }] },
        { "name": "smtp_username", "validators": "presence" },
        { "name": "smtp_password", "validators": "presence" },
        { "name": "smtp_tls", "type": "bool" },
        {
            "name": "smtp_can_test",
            calculate ( data ) {
                if ( data.smtp_host && data.smtp_port && data.smtp_username && data.smtp_password ) {
                    return true;
                }
                else {
                    return false;
                }
            },
        },

        // telegram
        "telergam_bot_name",
        "telegram_bot_key",
        { "name": "telegram_bot_enabled", "type": "bool" },
        { "name": "telegram_signin_enabled", "type": "bool" },
    ],
} );

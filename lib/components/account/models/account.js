export default Ext.define( "", {
    "extend": "Ext.data.Model",

    "fields": [
        { "name": "id", "type": "string" },

        // fields
        { "name": "created", "type": "date" },
        { "name": "last_activity", "type": "date" },
        "name",
        "locale",
        "email",
        { "name": "email_confirmed", "type": "bool" },
        { "name": "telegram_username", "type": "string" },
        { "name": "telegram_active", "type": "bool" },
    ],
} );

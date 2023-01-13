export default Ext.define( "", {
    "extend": "Ext.data.Model",

    "fields": [

        // fields
        "name",
        "description",
        "type",
        { "name": "internal", "type": "bool", "allowNull": true },
        { "name": "email", "type": "bool", "allowNull": true },
        { "name": "telegram", "type": "bool", "allowNull": true },
        { "name": "push", "type": "bool", "allowNull": true },

        // calculated
        { "name": "title", "calculate": data => `<div class="notification-type-name">${data.name}</div><div class="notification-type-description">${data.description}</div>` },

        { "name": "internal_enabled", "calculate": data => data.internal != null },
        { "name": "email_enabled", "calculate": data => data.email != null },
        { "name": "telegram_enabled", "calculate": data => data.telegram != null },
        { "name": "push_enabled", "calculate": data => data.push != null },
    ],
} );

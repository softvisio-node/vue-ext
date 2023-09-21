import app from "#app";

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
        "avatar_url",
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
        "api_user_id",
        "api_user_email",
        "api_user_avatar_url",

        // calculated
        {
            "name": "created_text",
            calculate ( data ) {
                return `${app.locale.formatDate( data.created, "dateStyle:short" )} (${app.locale.formatRelativeDate( data.created )})`;
            },
        },

        {
            "name": "last_activity_text",
            calculate ( data ) {
                return `${app.locale.formatDate( data.last_activity, "dateStyle:short" )} (${app.locale.formatRelativeDate( data.last_activity )})`;
            },
        },
    ],
} );

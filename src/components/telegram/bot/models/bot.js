import app from "@/app";

export default Ext.define( "", {
    "extend": "Ext.data.Model",

    "fields": [
        { "name": "id", "type": "string" },

        // fields
        "acl_id",
        { "name": "acl_user_permissions", "convert": value => new Set( value ) },
        "type",
        { "name": "static", "type": "bool" },
        "locales",
        { "name": "created", "type": "date" },

        "name",
        "short_description",
        "description",

        "telegram_id",
        "telegram_username",
        { "name": "telegram_can_join_groups", "type": "bool" },
        { "name": "telegram_can_read_all_group_messages", "type": "bool" },
        { "name": "telegram_supports_inline_queries", "type": "bool" },

        "total_users",
        "total_subscribed_users",
        "total_unsubscribed_users",
        "total_returned_users",
        "total_banned_users",

        { "name": "started", "type": "bool" },
        { "name": "error", "type": "bool" },
        "error_text",

        // calculated
        { "name": "can_update", "calculate": data => data.acl_user_permissions.has( "telegram/bot:update" ) },

        { "name": "status_text", "calculate": data => ( data.started ? app.locale.l10n( `vue-ext`, `Started` ) : app.locale.l10n( `vue-ext`, `Stopped` ) ) },

        { "name": "description_html", "calculate": data => data.description.replaceAll( "\n", "<br/>" ) },
    ],
} );

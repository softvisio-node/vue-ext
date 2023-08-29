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
        { "name": "name_html", "calculate": data => `<b>${data.name}</b><br/>@${data.telegram_username}` },

        { "name": "can_update", "calculate": data => data.acl_user_permissions.has( "telegram/bot:update" ) },
        { "name": "can_update_acl", "calculate": data => data.acl_user_permissions.has( "acl:update" ) },

        { "name": "status_text", "calculate": data => ( data.started ? app.locale.l10n( `vue-ext`, `Started` ) : app.locale.l10n( `vue-ext`, `Stopped` ) ) },

        { "name": "total_subscribed_users_percent", "calculate": data => app.locale.formatNumber( data.total_subscribed_users / data.total_users ) },
        { "name": "total_subscribed_users_percent_text", "calculate": data => app.locale.formatPercent( data.total_subscribed_users / data.total_users ) },

        { "name": "total_subscribed_users_text", "calculate": data => `${data.total_subscribed_users} (${data.total_subscribed_users_percent_text})` },

        { "name": "total_unsubscribed_users_percent", "calculate": data => app.locale.formatNumber( data.total_unsubscribed_users / data.total_users ) },
        { "name": "total_unsubscribed_users_percent_text", "calculate": data => app.locale.formatPercent( data.total_unsubscribed_users / data.total_users ) },
        { "name": "total_unsubscribed_users_text", "calculate": data => `${data.total_unsubscribed_users} (${data.total_unsubscribed_users_percent_text})` },
    ],
} );

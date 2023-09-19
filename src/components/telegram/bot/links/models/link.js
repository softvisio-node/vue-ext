import app from "#app";

export default Ext.define( "", {
    "extend": "Ext.data.Model",

    "proxy": {
        "api": {
            "read": "telegram/bots/links/get-links-list",
        },
    },

    "fields": [
        { "name": "id", "type": "string" },

        // fields
        "name",
        "description",
        "link",
        { "name": "created", "type": "date" },
        { "name": "last_user_created", "type": "date" },

        "total_users",
        "total_subscribed_users",
        "total_unsubscribed_users",
        "total_returned_users",
        "total_banned_users",

        // calculated
        { "name": "created_text", "calculate": data => app.locale.formatDate( data.created, "dateStyle:short,timeStyle:short" ) },
        { "name": "created_relative", "calculate": data => app.locale.formatRelativeDate( data.created ) },
        { "name": "created_html", "calculate": data => `${data.created_text} (${data.created_relative})` },

        { "name": "last_user_created_text", "calculate": data => ( data.last_user_created ? app.locale.formatDate( data.created, "dateStyle:short,timeStyle:short" ) : "--" ) },
        { "name": "last_user_created_relative", "calculate": data => ( data.last_user_created ? app.locale.formatRelativeDate( data.created ) : "--" ) },
        {
            "name": "last_user_created_html",
            calculate ( data ) {
                if ( data.last_user_created ) {
                    return `${data.created_text} (${data.created_relative})`;
                }
                else {
                    return "--";
                }
            },
        },

        {
            "name": "total_subscribed_users_percent",
            calculate ( data ) {
                if ( data.total_users ) {
                    return app.locale.formatNumber( data.total_subscribed_users / data.total_users );
                }
                else {
                    return 0;
                }
            },
        },

        { "name": "total_subscribed_users_percent_text", "calculate": data => app.locale.formatPercent( data.total_subscribed_users_percent ) },

        { "name": "total_subscribed_users_text", "calculate": data => `${data.total_subscribed_users} (${data.total_subscribed_users_percent_text})` },

        {
            "name": "total_unsubscribed_users_percent",
            calculate ( data ) {
                if ( data.total_users ) {
                    return app.locale.formatNumber( data.total_unsubscribed_users / data.total_users );
                }
                else {
                    return 0;
                }
            },
        },

        { "name": "total_unsubscribed_users_percent_text", "calculate": data => app.locale.formatPercent( data.total_unsubscribed_users_percent ) },

        { "name": "total_unsubscribed_users_text", "calculate": data => `${data.total_unsubscribed_users} (${data.total_unsubscribed_users_percent_text})` },

        {
            "name": "total_returned_users_percent",
            calculate ( data ) {
                if ( data.total_users ) {
                    return app.locale.formatNumber( data.total_returned_users / data.total_users );
                }
                else {
                    return 0;
                }
            },
        },

        { "name": "total_returned_users_percent_text", "calculate": data => app.locale.formatPercent( data.total_returned_users_percent ) },

        { "name": "total_returned_users_text", "calculate": data => `${data.total_returned_users} (${data.total_returned_users_percent_text})` },

        {
            "name": "total_banned_users_percent",
            calculate ( data ) {
                if ( data.total_users ) {
                    return app.locale.formatNumber( data.total_banned_users / data.total_users );
                }
                else {
                    return 0;
                }
            },
        },

        { "name": "total_banned_users_percent_text", "calculate": data => app.locale.formatPercent( data.total_banned_users_percent ) },

        { "name": "total_banned_users_text", "calculate": data => `${data.total_banned_users} (${data.total_banned_users_percent_text})` },
    ],
} );

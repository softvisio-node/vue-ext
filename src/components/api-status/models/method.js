export default Ext.define( "", {
    "extend": "Ext.data.Model",

    "proxy": {
        "api": {
            "read": "administration/health/get-api-methods",
        },
    },

    "fields": [
        "id",

        //
        "active_calls",
        "calls",
        "duration",
        "exceptions",
        "avg_duration",
        "calls_share",
        "duration_share",
        "exceptions_share",

        // { "name": "active_requests_limit", "type": "integer", "allowNull": true },
        // { "name": "active_requests_limit_text", "calculate": data => data.active_requests_limit || "&mdash;" },

        // { "name": "active_requests_user_limit", "type": "integer", "allowNull": true },
        // { "name": "active_requests_user_limit_text", "calculate": data => data.active_requests_user_limit || "&mdash;" },

        // { "name": "total_active_requests", "type": "integer" },
        // { "name": "active_requests_text", "calculate": data => `${data.total_active_requests} / ${data.active_requests_limit_text}` },
        // { "name": "active_requests_value", "calculate": data => ( data.active_requests_limit ? data.total_active_requests / data.active_requests_limit : 0.5 ) },
    ],
} );

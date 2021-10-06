export default Ext.define( "", {
    "extend": "Ext.data.Model",

    "fields": [
        "id",

        //
        { "name": "id_text", "calculate": data => `<b style="font-size:1.1em">${data.id}</b>` },

        { "name": "last_updated", "type": "date" },

        { "name": "active_requests_limit", "type": "integer", "allowNull": true },
        { "name": "active_requests_limit_text", "calculate": data => data.active_requests_limit || "&mdash;" },

        { "name": "active_requests_user_limit", "type": "integer", "allowNull": true },
        { "name": "active_requests_user_limit_text", "calculate": data => data.active_requests_user_limit || "&mdash;" },

        { "name": "total_active_requests", "type": "integer" },
        { "name": "active_requests_text", "calculate": data => `${data.total_active_requests} / ${data.active_requests_limit_text}` },
        { "name": "active_requests_value", "calculate": data => ( data.active_requests_limit ? data.total_active_requests / data.active_requests_limit : 0.5 ) },

        // charts
        { "name": "load", "type": "array" },
        { "name": "requests", "type": "array" },
    ],
} );

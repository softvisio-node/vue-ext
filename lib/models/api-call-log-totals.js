export default Ext.define( "", {
    "extend": "Ext.data.Model",

    "proxy": {
        "api": {
            "read": "admin/api-call-log/read-totals",
        },
    },

    "fields": [

        //
        "id",
        { "name": "active_requests_limit", "type": "integer", "allowNull": true },
        { "name": "active_requests_user_limit", "type": "integer", "allowNull": true },
        { "name": "total_active_requests", "type": "integer" },

        // CHARTS
        { "name": "load", "type": "array" },
        { "name": "requests", "type": "array" },

        {
            "name": "name",
            calculate ( data ) {
                return `
                    <b style="font-size:1.2em">${data.id}</b>
                    <br/><br/>Total Active Requests: ${data.total_active_requests}
                    <br/><br/>Active Requests Limit: ${data.active_requests_limit || "&mdash;"}
                    <br/>Active Requests Limit per User: ${data.active_requests_user_limit || "&mdash;"}
                `;
            },
        },
    ],
} );

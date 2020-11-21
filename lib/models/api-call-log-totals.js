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
        { "name": "max_running_requests", "type": "integer", "allowNull": true },
        { "name": "max_running_requests_user", "type": "integer", "allowNull": true },
        { "name": "stat", "type": "array" },
        {
            "name": "name",
            calculate ( data ) {
                return `<b style="font-size:1.2em">${data.id}</b><br/><br/>Max. Running Requests: ${data.max_running_requests || "&mdash;"}<br/>Max. Running Requests per User: ${data.max_running_requests_user || "&mdash;"}`;
            },
        },
    ],
} );

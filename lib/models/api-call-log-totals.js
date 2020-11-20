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
    ],
} );

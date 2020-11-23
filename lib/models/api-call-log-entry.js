export default Ext.define( "", {
    "extend": "Ext.data.Model",

    "proxy": {
        "api": {
            "read": "admin/api-call-log/read-log",
        },
    },

    "fields": [

        //
        "method_id",
        "user_id",
        { "name": "started", "type": "date" },
        { "name": "finished", "type": "date" },
        { "name": "runtime", "type": "integer" },
        { "name": "is_error", "type": "bool" },
        { "name": "is_exception", "type": "bool" },
        { "name": "status", "type": "integer" },
        "reason",
    ],
} );

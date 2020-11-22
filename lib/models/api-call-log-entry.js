export default Ext.define( "", {
    "extend": "Ext.data.Model",

    "proxy": {
        "api": {
            "read": "admin/api-call-log/read-entries",
        },
    },

    "fields": [

        //
        "method_id",
        "user_id",
        { "name": "started", "type": "date" },
        { "name": "finished", "type": "date" },
        "runtime",
        "is_declined",
        "is_error",
        "is_exception",
        "status",
        "reason",
    ],
} );

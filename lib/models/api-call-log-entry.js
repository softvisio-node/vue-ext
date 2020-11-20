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
        "api_version",
        "api_namespace",
        "method_name",
        "user_id",
        "started",
        "finished",
        "runtime",
        "is_declined",
        "is_error",
        "is_exception",
        "status",
        "reason",
    ],
} );

export default Ext.define( "", {
    "extend": "Ext.data.Model",

    "proxy": {
        "api": {
            "read": "administration/api-status/read-api-method-access-log",
        },
    },

    "fields": [

        //
        "method_id",
        "user_id",
        { "name": "started", "type": "date" },
        { "name": "finished", "type": "date" },

        { "name": "runtime", "type": "integer" },
        { "name": "runtime_text", "calculate": data => Ext.util.Format.number( data.runtime / 1000, "#.##" ) },

        { "name": "is_error", "type": "bool" },

        { "name": "is_exception", "type": "bool" },
        { "name": "is_exception_text", "calculate": data => ( data.is_exception ? "YES" : "NO" ) },

        { "name": "status", "type": "integer" },
        { "name": "status_label", "calculate": data => data.status },

        "status_text",
    ],
} );

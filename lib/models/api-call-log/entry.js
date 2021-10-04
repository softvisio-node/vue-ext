export default Ext.define( "", {
    "extend": "Ext.data.Model",

    "proxy": {
        "api": {
            "read": "admin/apiCallLog/readLog",
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
        { "name": "is_exception_text", "calculate": data => Ext.util.Format.label( data.is_exception ? "YES" : "NO", data.is_exception ? "red" : "green" ) },

        { "name": "status", "type": "integer" },
        { "name": "status_text", "calculate": data => Ext.util.Format.label( data.status, data.status >= 200 && data.status < 300 ? "green" : "red" ) },

        "status_text",
    ],
} );

export default Ext.define( "", {
    "extend": "Ext.data.Model",

    "proxy": {
        "api": {
            "read": "admin/apiCallLog/readLog",
        },
    },

    "fields": [

        //
        "methodId",
        "userId",
        { "name": "started", "type": "date" },
        { "name": "finished", "type": "date" },

        { "name": "runtime", "type": "integer" },
        { "name": "runtimeText", "calculate": data => Ext.util.Format.number( data.runtime / 1000, "#.##" ) },

        { "name": "isError", "type": "bool" },

        { "name": "isException", "type": "bool" },
        { "name": "isExceptionText", "calculate": data => Ext.util.Format.label( data.isException ? "YES" : "NO", data.isException ? "red" : "green" ) },

        { "name": "status", "type": "integer" },
        { "name": "statusLabel", "calculate": data => Ext.util.Format.label( data.status, data.status >= 200 && data.status < 300 ? "green" : "red" ) },

        "statusText",
    ],
} );

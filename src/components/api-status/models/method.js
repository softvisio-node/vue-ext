export default Ext.define( "", {
    "extend": "Ext.data.Model",

    "proxy": {
        "api": {
            "read": "administration/health/get-api-methods",
        },
    },

    "fields": [
        "id",

        // fields
        "active_calls",
        "calls",
        "duration_per_call",
        "exceptions",
        "exceptions_per_call",
        "calls_share",
        "duration_share",
        "exceptions_share",

        // calculated
        {
            "name": "calls_text",
            "calculate": data => data.calls + " / " + Ext.util.Format.percent( data.calls_share, "minimumFractionDigits:1,maximumFractionDigits:1" ),
        },

        {
            "name": "duration_text",
            "calculate": data => Ext.util.Format.percent( data.duration_share, "minimumFractionDigits:1,maximumFractionDigits:1" ),
        },

        {
            "name": "duration_per_call_text",
            "calculate": data => Ext.util.Format.number( data.duration_per_call, "maximumFractionDigits:1,minimumFractionDigits:1" ),
        },

        {
            "name": "exceptions_text",
            "calculate": data => data.exceptions + " / " + Ext.util.Format.percent( data.exceptions_share, "minimumFractionDigits:1,maximumFractionDigits:1" ),
        },

        {
            "name": "exceptions_per_call_text",
            "calculate": data => Ext.util.Format.number( data.exceptions_per_call, "maximumFractionDigits:1,minimumFractionDigits:1" ),
        },
    ],
} );

export default Ext.define( "", {
    "extend": "Ext.data.Model",

    "proxy": {
        "api": {
            "read": "development/cron/get-schedule",
        },
    },

    "fields": [
        { "name": "id", "type": "string" },

        // fields
        "module",
        "name",
        "cron",
        "timezone",
        "query",
        "run_missed",
        { "name": "next_start", "type": "date" },
        { "name": "last_start", "type": "date" },
        { "name": "last_finish", "typ": "date" },
        { "name": "error", "type": "bool" },
        "status_text",
    ],
} );

export default Ext.define( "", {
    "extend": "Ext.data.Model",

    "proxy": {
        "api": {
            "read": "notifications/read",
        },
    },

    "fields": [
        { "name": "id", "type": "string" },
        { "name": "created", "type": "date" },
        { "name": "expired", "type": "date" },

        //
        { "name": "read", "type": "bool" },
        { "name": "done", "type": "bool" },

        "subject",
        "body",
        "meta",

        { "name": "relative_time", "type": "string", "persist": false },
    ],

    "summary": {
        "total": { "type": "integer" },
        "total_undone_unread": { "type": "integer" },
    },
} );

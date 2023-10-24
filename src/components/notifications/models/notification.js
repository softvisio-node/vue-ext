export default Ext.define( null, {
    "extend": "Ext.data.Model",

    "proxy": {
        "api": {
            "read": "account/notifications/get-notifications-list",
        },
    },

    "fields": [
        { "name": "id", "type": "string" },
        { "name": "created", "type": "date" },
        { "name": "expired", "type": "date" },

        //
        { "name": "done", "type": "bool" },

        { "name": "subjext", "convert": value => value?.replaceAll( /\n+/g, " " ) },
        { "name": "body", "convert": value => value?.replaceAll( /\n+/g, "<br/>" ) },

        { "name": "relative_time", "type": "string", "persist": false },
    ],

    "summary": {
        "total": { "type": "integer" },
    },
} );

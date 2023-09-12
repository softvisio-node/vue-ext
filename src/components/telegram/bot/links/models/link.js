export default Ext.define( "", {
    "extend": "Ext.data.Model",

    "proxy": {
        "api": {
            "read": "telegram/bots/links/read",
        },
    },

    "fields": [
        { "name": "id", "type": "string" },

        // fields
    ],
} );

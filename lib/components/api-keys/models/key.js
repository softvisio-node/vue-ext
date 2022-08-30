export default Ext.define( "", {
    "extend": "Ext.data.Model",

    "proxy": {
        "api": {
            "create": "account/api-keys/create",
            "read": "account/api-keys/read",
            "update": "account/api-keys/update",
            "destroy": "account/api-keys/delete",
        },
    },

    "fields": [
        { "name": "id", "type": "string" },

        // fields
        "name",
        { "name": "created", "type": "date" },
        { "name": "last_activity", "type": "date" },
        { "name": "enabled", "type": "bool" },
        "roles",

        // calculated
        {
            "name": "last_activity_text",
            calculate ( data ) {
                if ( !data.last_activity ) {
                    return "&mdash;";
                }
                else {
                    return Ext.util.Format.date( data.last_activity, "dateStyle:short,timeStyle:short" );
                }
            },
        },
    ],
} );

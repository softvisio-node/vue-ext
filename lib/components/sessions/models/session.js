export default Ext.define( "", {
    "extend": "Ext.data.Model",

    // "proxy": {
    //     "api": {
    //         "create": "admin/users/create",
    //         "read": "admin/users/read",
    //         "update": "admin/users/update",
    //         "destroy": "admin/users/delete",
    //     },
    // },

    "fields": [
        { "name": "id", "type": "string" },

        // fields
        { "name": "created", "type": "date" },
        { "name": "last_activity", "type": "date" },
        "user_agent",
        "remote_address",
        { "name": "current_session", "type": "bool" },

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

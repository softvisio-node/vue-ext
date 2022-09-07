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
        { "name": "current_session", "type": "bool" },
        "remote_address",
        "user_agent",
        "browser_name",
        "browser_version",
        "browser_major",
        "engine_name",
        "engine_version",
        "os_name",
        "os_version",
        "device_vendor",
        "device_model",
        "device_type",
        "cpu_architecture",

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

        {
            "name": "browser_text",
            calculate ( data ) {
                return data.browser_name || "";
            },
        },

        {
            "name": "os_text",
            calculate ( data ) {
                const labels = [];

                if ( data.os_name ) {
                    labels.push( data.os_name );

                    if ( data.os_version ) labels.push( data.os_version );
                }

                return labels.join( " " );
            },
        },

        {
            "name": "device_text",
            calculate ( data ) {
                const labels = [];

                if ( data.device_vendor ) {
                    labels.push( data.device_vendor );

                    if ( data.device_model ) labels.push( data.device_model );
                }

                return labels.join( " " );
            },
        },
    ],
} );

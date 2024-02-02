export default Ext.define( null, {
    "extend": "Ext.data.Model",

    // "proxy": {
    //     "api": {
    //         "create": "administration/users/create",
    //         "read": "administration/users/get-users-list",
    //         "update": "administration/users/update",
    //         "destroy": "administration/users/delete",
    //     },
    // },

    "fields": [
        "id",

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
            "name": "device_text",
            calculate ( data ) {
                var device;

                if ( data.device_vendor ) {
                    device = data.device_vendor;

                    if ( data.device_model ) device += " " + data.device_model;
                }

                return device || "&mdash;";
            },
        },

        {
            "name": "os_text",
            calculate ( data ) {
                var os;

                if ( data.os_name ) {
                    os = data.os_name;

                    if ( data.os_version ) os += " " + data.os_version;
                }

                return os || "&mdash;";
            },
        },

        {
            "name": "browser_text",
            calculate ( data ) {
                return data.browser_name || "&mdash;";
            },
        },
    ],
} );

export default Ext.define( "", {
    "extend": "Ext.data.Model",

    "proxy": {
        "api": {
            "create": "electronUpdates/create",
            "read": "electronUpdates/read",
            "destroy": "electronUpdates/delete",
        },
    },

    "fields": [
        "id",

        //
        { "name": "created", "type": "date" },
        { "name": "published", "type": "bool" },
        "platform",
        "arch",
        "version",
        "version_sort",

        {
            "name": "platform_name",
            calculate ( data ) {
                if ( data.platform === "win32" ) {
                    return `<i class="fab fa-windows"></i> Windows`;
                }
                else if ( data.platform === "linux" ) {
                    return `<i class="fab fa-linux"></i> Linux`;
                }
                else if ( data.platform === "darwin" ) {
                    return `<i class="fab fa-apple"></i> MacOS`;
                }
            },
        },
    ],
} );

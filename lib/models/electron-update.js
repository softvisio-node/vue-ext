export default Ext.define( "", {
    "extend": "Ext.data.Model",

    "proxy": {
        "api": {
            "create": "electron-updates/create",
            "read": "electron-updates/read",
            "destroy": "electron-updates/delete",
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
    ],
} );

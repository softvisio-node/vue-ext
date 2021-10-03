export default Ext.define( "", {
    "extend": "Ext.data.Model",

    "proxy": {

        // "api": {
        //     "create": "admin/users/create",
        //     "read": "admin/users/read",
        //     "update": "admin/users/update",
        //     "destroy": "admin/users/delete",
        // },
    },

    "fields": [
        { "name": "id", "type": "string" },

        //
        { "name": "read", "type": "bool" },
        { "name": "date", "type": "date" },
        "subject",
        "body",

        { "name": "relativeTime", "persist": false },
    ],
} );

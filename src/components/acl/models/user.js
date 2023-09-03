import app from "#app";

export default Ext.define( "", {
    "extend": "Ext.data.Model",

    "proxy": {
        "api": {
            "read": "acl/read-acl-users",
        },
    },

    "fields": [
        { "name": "id", "type": "string" },

        // fields
        { "name": "acl_id", "type": "string" },
        { "name": "email", "type": "string" },
        { "name": "avatar", "type": "string" },
        { "name": "created", "type": "date" },
        { "name": "enabled", "type": "bool" },
        { "name": "roles", "type": "array", "allowNull": true },

        // calculated
        { "name": "editable", "calculate": data => data.id !== app.user.id },
    ],
} );

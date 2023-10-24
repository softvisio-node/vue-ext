import app from "#app";

export default Ext.define( null, {
    "extend": "Ext.data.Model",

    "proxy": {
        "api": {
            "read": "acl/get-acl-users-list",
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

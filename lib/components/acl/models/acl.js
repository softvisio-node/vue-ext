export default Ext.define( "", {
    "extend": "Ext.data.Model",

    "fields": [
        { "name": "id", "type": "string" },

        // fields
        { "name": "acl_permissions", "defaultValue": {} },

        // permissions
        { "name": "can_add_user", "calculate": data => !!data.acl_permissions["/v1/acl/add-user"] },
    ],
} );

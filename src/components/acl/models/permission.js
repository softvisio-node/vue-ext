import app from "#app";

export default Ext.define( null, {
    "extend": "Ext.data.Model",

    "fields": [

        // fields
        { "name": "permissions", "convert": value => app.user.permissions.addPermissions( value ) },

        // calculatte
        { "name": "create", "calculate": data => data.permissions.has( "acl:create" ) },
        { "name": "read", "calculate": data => data.permissions.has( "acl:read" ) },
        { "name": "update", "calculate": data => data.permissions.has( "acl:update" ) },
        { "name": "delete", "calculate": data => data.permissions.has( "acl:delete" ) },
    ],
} );

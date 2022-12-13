export default Ext.define( "", {
    "extend": "Ext.data.Model",

    "fields": [

        // fields
        { "name": "permissions", "convert": value => new Set( value ) },

        // permissions
        { "name": "can_add_user", "calculate": data => data.permissions.has["acl:create"] },
    ],
} );

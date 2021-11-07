export default Ext.define( "", {
    "extend": "Ext.data.Model",

    "fields": [
        { "name": "id", "type": "string" },

        //
        { "name": "username", "type": "string" },
        { "name": "avatar", "type": "string" },
        { "name": "role_id", "type": "string" },
        { "name": "role_name", "type": "string" },
        { "name": "role_description", "type": "string" },
    ],
} );

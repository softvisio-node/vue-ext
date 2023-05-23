export default Ext.define( "", {
    "extend": "Ext.data.Model",

    "fields": [
        { "name": "id", "type": "string" },

        // fields
        "email",
        { "name": "email_confirmed", "type": "bool" },
    ],
} );

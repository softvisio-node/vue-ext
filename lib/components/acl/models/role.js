export default Ext.define( "", {
    "extend": "Ext.data.Model",

    "fields": [
        { "name": "id", "type": "string" },

        // fields
        { "name": "name", "type": "string" },
        { "name": "description", "type": "string" },
        { "name": "readonly", "type": "bool" },
        { "name": "enabled", "type": "bool" },

        // calculated
        { "name": "role_html", "calculate": data => `<b>${data.name}</b><br/>${data.description}` },
    ],
} );

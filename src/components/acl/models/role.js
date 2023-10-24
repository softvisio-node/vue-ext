export default Ext.define( null, {
    "extend": "Ext.data.Model",

    "fields": [
        { "name": "id", "type": "string" },

        // fields
        { "name": "name", "type": "string" },
        { "name": "description", "type": "string" },
        { "name": "readonly", "type": "bool" },
        { "name": "enabled", "type": "bool" },

        // calculated
        { "name": "title_html", "calculate": data => `<b>${data.name}</b><br/>${data.description}` },
    ],
} );

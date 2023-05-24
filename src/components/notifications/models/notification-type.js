export default Ext.define( "", {
    "extend": "Ext.data.Model",

    "fields": [
        "id",

        // fields
        "name",
        "description",
        "channels",

        // calculated
        { "name": "title", "calculate": data => `<div class="notification-type-name">${data.name}</div><div class="notification-type-description">${data.description}</div>` },
    ],
} );

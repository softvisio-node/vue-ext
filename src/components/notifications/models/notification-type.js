import app from "@/app";

export default Ext.define( "", {
    "extend": "Ext.data.Model",

    "fields": [
        "id",

        // fields
        "name",
        "description",
        "channels",

        // calculated
        { "name": "title", "calculate": data => `<div class="notification-type-name">${app.locale.i18nd( "backend", data.name )}</div>${app.locale.i18nd( "backend", data.description )}` },
    ],
} );

import app from "#app";

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
        { "name": "title_html", "calculate": data => `<b>${app.locale.l10n( data.name, { "domain": "backend" } )}</b><br/>${app.locale.l10n( data.description, { "domain": "backend" } )}` },
    ],
} );

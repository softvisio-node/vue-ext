import app from "#app";

export default Ext.define( "", {
    "extend": "Ext.data.Model",

    "fields": [
        "id",

        // fields
        "name",
        "description",
        "channels",

        // calculated
        { "name": "title", "calculate": data => `<div class="notification-type-name">${app.locale.l10nd( "backend", data.name )}</div>${app.locale.l10nd( "backend", data.description )}` },

        {
            "name": "enabled",
            "type": "bool",
            calculate ( data ) {
                for ( const channel of Object.values( data.channels || {} ) ) {
                    if ( channel.enabled ) return true;
                }

                return false;
            },
        },

        {
            "name": "editable",
            "type": "bool",
            calculate ( data ) {
                for ( const channel of Object.values( data.channels || {} ) ) {
                    if ( channel.editable ) return true;
                }

                return false;
            },
        },

        {
            "name": "subscribed",
            "type": "bool",
            calculate ( data ) {
                for ( const channel of Object.values( data.channels || {} ) ) {
                    if ( channel.editable && channel.subscribed ) return true;
                }

                return false;
            },
        },
    ],
} );

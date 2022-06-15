export * from "@softvisio/vue/utils";

export async function confirm ( title, message ) {
    return new Promise( resolve => {
        Ext.Msg.show( {
            "title": title || null,
            "message": message || null,
            "buttons": [
                {
                    "id": "yes",
                    "text": window.i18n( "Yes" ),
                },
                {
                    "id": "no",
                    "text": window.i18n( "No" ),
                },
            ],
            "defaultFocus": "#yes",
            "prompt": false,
            "fn": answer => {
                resolve( answer === "yes" );
            },
        } );
    } );
}

export async function prompt ( title, message ) {
    return new Promise( resolve => {
        Ext.Msg.prompt( title, message, function ( buttonId, text ) {
            if ( buttonId === "ok" ) {
                resolve( text.trim() );
            }
            else {
                resolve;
            }
        } );
    } );
}

export function toast ( msg, timeout ) {
    if ( Ext.isObject( msg ) ) msg = msg.statusText ?? msg + "";

    Ext.toast( msg, timeout || 3000 );
}

export * from "@softvisio/vue/utils";

export async function confirm ( title, message ) {
    return new Promise( resolve => {
        Ext.Msg.confirm( title || "Confirmation", message || "Are you sure you want to do that?", function ( buttonId ) {
            resolve( buttonId === "yes" ? true : false );
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

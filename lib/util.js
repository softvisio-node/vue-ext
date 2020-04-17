export * from "@softvisio/vue/lib/util";

export async function confirm ( title, message ) {
    return new Promise( ( resolve ) => {
        Ext.Msg.confirm( title || "Confirmation", message || "Are you sure you want to do that?", function ( buttonId ) {
            resolve( buttonId === "yes" ? true : false );
        } );
    } );
}

export function toast ( msg, timeout ) {
    if ( Ext.isObject( msg ) ) {
        if ( msg.reason ) {
            msg = msg.reason;
        }
        else if ( msg.toString ) {
            msg = msg.toString();
        }
    }

    Ext.toast( msg, timeout || 3000 );
}

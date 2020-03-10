export function copyToClipboard ( str ) {
    const el = document.createElement( "textarea" );

    el.value = str;

    el.style.display = "none";
    document.body.appendChild( el );

    el.select();
    document.execCommand( "copy" );

    document.body.removeChild( el );
}

export function downloadFile ( filename, mime, data ) {
    const el = document.createElement( "a" );

    el.setAttribute( "href", "data:" + mime + "," + encodeURIComponent( data ) );
    el.setAttribute( "download", filename );

    el.style.display = "none";
    document.body.appendChild( el );

    el.click();

    document.body.removeChild( el );
}

export async function sleep ( timeout ) {
    new Promise( ( resolve ) => setTimeout( resolve, timeout ) );
}

export async function confirm ( title, message ) {
    return new Promise( ( resolve ) => {
        Ext.Msg.confirm( title, message, function ( buttonId ) {
            resolve( buttonId === "yes" ? true : false );
        } );
    } );
}

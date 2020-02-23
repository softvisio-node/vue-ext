export default async function ( title, message ) {
    return new Promise( ( resolve ) => {
        Ext.Msg.confirm( title, message, function ( buttonId ) {
            resolve( buttonId === "yes" ? true : false );
        } );
    } );
}

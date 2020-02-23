export default async function ( timeout ) {
    new Promise( ( resolve ) => setTimeout( resolve, timeout ) );
}

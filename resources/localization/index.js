export default async function ( locale ) {
    return import( "./" + locale );
}

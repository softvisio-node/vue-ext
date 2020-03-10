export default function ( filename, mime, data ) {
    const el = document.createElement( "a" );

    el.setAttribute( "href", "data:" + mime + "," + encodeURIComponent( data ) );
    el.setAttribute( "download", filename );
    el.style.display = "none";
    document.body.appendChild( el );
    el.click();
    document.body.removeChild( el );
}

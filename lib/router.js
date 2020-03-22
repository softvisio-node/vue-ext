export default class {
    constructor () {
        this.root = null;
        this.suspended = false;
    }

    init ( cmp ) {
        this.root = cmp;

        window.onhashchange = this.onHashChange.bind( this );
    }

    onHashChange () {
        if ( this.suspended ) return;

        this.route( this.root );
    }

    suspend () {
        this.suspended = true;
    }

    resume () {
        this.suspended = false;
    }

    route ( cmp ) {
        const hash = this.getHash();

        var route, path;

        if ( hash ) {
            path = hash.split( "/" );

            // remove "#"
            path.shift();

            route = path.shift();
        }

        cmp.onRoute( route, path );
    }

    // TODO test relative path
    routeTo ( path, force ) {
        var hash = this.getHash(),
            newHash;

        // path is absolute
        if ( path.charAt( 0 ) === "/" ) {
            newHash = path;
        }

        // path is relative
        else {
            newHash = hash.replace( /\/.+/, `/${path}` );
        }

        window.location.hash = newHash;

        if ( newHash === hash && force ) this.onHashChange();
    }

    getHash () {
        var hash = window.location.hash;

        if ( !hash ) {
            hash = "/";

            const suspended = this.suspended;

            this.suspend();

            window.location.hash = hash;

            if ( !suspended ) this.resume();
        }
        else {
            hash = hash.substring( 1 );
        }

        return hash;
    }
}

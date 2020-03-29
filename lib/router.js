const Route = class {
    constructor ( router ) {
        this.router = router;
        this.hash = router.getHash();
        this.routes = [];

        if ( this.hash ) {
            this.routes = this.hash.split( "/" );

            // remove ""
            if ( this.routes[0] === "" ) this.routes.shift();
        }
    }

    get () {
        return this.routes[0];
    }

    shift () {
        this.routes.shift();
    }

    forward ( cmp ) {
        // do nothing if component has no onRoute method
        if ( !cmp.onRoute ) return;

        cmp.onRoute( this );
    }
};

export default class {
    constructor () {
        this.root = null;
        this.suspended = false;
    }

    init ( root ) {
        this.root = root;

        window.onhashchange = this.onHashChange.bind( this );
    }

    onHashChange () {
        if ( this.suspended ) return;

        this.reload();
    }

    suspend () {
        this.suspended = true;
    }

    resume () {
        this.suspended = false;
    }

    reload () {
        var route = new Route( this );

        route.forward( this.root );
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
            // remove "#"
            hash = hash.substring( 1 );
        }

        return hash;
    }
}

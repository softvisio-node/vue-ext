function getPath ( base, path, depth ) {
    // absolute path
    if ( path != null && path.charAt( 0 ) === "/" ) {
        return path;
    }

    // relative path
    else {
        let parentPath;

        if ( !depth ) {
            parentPath = "/" + this.path.join( "/" );
        }
        else {
            parentPath = "/" + this.path.slice( 0, depth ).join( "/" );
        }

        // path is not specified
        if ( path == null || path === "" ) {
            return parentPath;
        }
        else if ( parentPath === "/" ) {
            return "/" + path;
        }
        else {
            return parentPath + "/" + path;
        }
    }
}

// splt path to array, remove "" segments
function splitHash ( hash ) {
    hash = hash.split( "/" ).filter( ( item ) => {
        return item !== "";
    } );

    return hash;
}

const Route = class {
    constructor ( router ) {
        this.router = router;
        this.hash = router.getHash();
        this.routes = [];
        this.stopped = false;
        this.path = [];

        if ( this.hash ) this.routes = splitHash( this.hash );
    }

    getPath ( path, depth ) {
        return getPath( this.path, path, depth );
    }

    get () {
        return this.routes[0];
    }

    shift () {
        var path = this.routes.shift();

        if ( path !== undefined ) this.path.push( path );

        return path;
    }

    forward ( cmp ) {
        // do nothing if component has no onRoute method
        if ( this.stopped || !cmp.onRoute ) return;

        cmp.onRoute( this );
    }

    stop () {
        this.stopped = true;
    }

    redirectTo ( path, args ) {
        this.stop();

        this.router.redirectTo( this.getPath( path, args.depth ), args );
    }
};

export default class {
    constructor () {
        this.root = null;
        this.suspended = false;
        this.route = null;
    }

    init ( root ) {
        this.root = root;

        this.resume();
    }

    onHashChange () {
        if ( this.suspended ) return;

        this.reload();
    }

    suspend () {
        window.onhashchange = null;

        this.suspended = true;
    }

    resume () {
        window.onhashchange = this.onHashChange.bind( this );

        this.suspended = false;
    }

    reload () {
        // stop current routing
        if ( this.route ) this.route.stop();

        this.route = new Route( this );

        this.route.forward( this.root );
    }

    // args: depth, force, replace
    redirectTo ( path, args ) {
        if ( !args ) args = {};

        var hash = this.getHash(),
            newHash;

        // path is absolute
        if ( path != null && path.charAt( 0 ) === "/" ) {
            newHash = path;
        }

        // path is relative
        else {
            newHash = getPath( splitHash( hash ), path, args.depth );
        }

        if ( args.replace ) {
            window.location.replace( "#" + newHash );
        }
        else {
            window.location.hash = "#" + newHash;
        }

        if ( newHash === hash && args.force ) this.onHashChange();
    }

    // TODO suspend() not works, produce double routing
    getHash () {
        var hash = window.location.hash;

        if ( !hash ) {
            hash = "/";

            // const suspended = this.suspended;

            // this.suspend();

            // TODO
            // window.location.replace( "#" + hash);

            // if ( !suspended ) this.resume();
        }
        else {
            // remove "#"
            hash = hash.substring( 1 );
        }

        return hash;
    }
}

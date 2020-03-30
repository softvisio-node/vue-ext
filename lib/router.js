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

function getHash () {
    var hash = window.location.hash;

    if ( !hash ) {
        hash = "/";

        setHash( hash, true, true );
    }
    else {
        // remove "#"
        hash = hash.substring( 1 );
    }

    return hash;
}

// splt path to array, remove "" segments
function splitHash ( hash ) {
    hash = hash.split( "/" ).filter( ( item ) => {
        return item !== "";
    } );

    return hash;
}

function setHash ( hash, replace, silent ) {
    if ( hash.charAt( 0 ) !== "#" ) hash = "#" + hash;

    if ( replace ) {
        if ( silent && window.history.replaceState ) {
            window.history.replaceState( null, null, hash );
        }
        else {
            window.location.replace( hash );
        }
    }
    else {
        if ( silent && window.history.pushState ) {
            window.history.pushState( null, null, hash );
        }
        else {
            window.location.hash = hash;
        }
    }
}

const Route = class {
    constructor ( router ) {
        this.router = router;
        this.hash = getHash();
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
        this.route = null;
    }

    init ( root ) {
        this.root = root;

        window.onhashchange = this.reload.bind( this );
    }

    reload () {
        // stop current routing
        if ( this.route ) this.route.stop();

        this.route = new Route( this );

        this.route.forward( this.root );
    }

    // args: depth, force, replace, silent
    redirectTo ( path, args ) {
        if ( !args ) args = {};

        var hash = getHash(),
            newHash;

        // path is absolute
        if ( path != null && path.charAt( 0 ) === "/" ) {
            newHash = path;
        }

        // path is relative
        else {
            newHash = getPath( splitHash( hash ), path, args.depth );
        }

        setHash( newHash, args.replace, args.silent );

        if ( newHash === hash && args.force ) this.reload();
    }
}

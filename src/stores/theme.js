import VueStore from "#vue/store";
import config from "#vue/config";
import Events from "#core/events";

const DARK_MODE_KEY = "darkMode";
const SYSTEM_DARK_MODE_KEY = "systemDarkMode";
const THEME_KEY = "theme";
const DEFAULT_THEME = {
    "base": config.theme.baseColor,
    "accent": config.theme.accentColor,
};

// XXX move to viewport
Ext.manifest.material = Ext.manifest.material || {};
Ext.manifest.material.toolbar = Ext.manifest.material.toolbar || {};
Ext.manifest.material.toolbar.dynamic = true;

class Store extends VueStore {

    // state
    _systemDarkMode;
    _darkMode;
    theme;

    #events = new Events( { "maxListeners": Infinity } );

    constructor () {
        super();

        // listen for system dark mode change
        window.matchMedia( "(prefers-color-scheme: dark)" ).addEventListener( "change", e => {
            if ( !this._systemDarkMode ) return;

            this.#setDarkMode( e.matches );
        } );

        // darkMode
        this._systemDarkMode = window.localStorage.getItem( SYSTEM_DARK_MODE_KEY );
        this._darkMode = window.localStorage.getItem( DARK_MODE_KEY );

        // system dark mode is not set
        if ( this._systemDarkMode == null ) {

            // user-defined dark mode is set
            if ( this._darkMode != null ) {
                this._systemDarkMode = false;
            }

            // user-defined dark mode is not set
            else {

                // follow system dark mode
                if ( config.theme.darkMode === "auto" ) {
                    this._systemDarkMode = true;
                }

                // use user-defined dark mode
                else {
                    this._systemDarkMode = false;
                }
            }
        }
        else {
            this._systemDarkMode = !!JSON.parse( this._systemDarkMode );
        }

        // follow system dark mode settings
        if ( this._systemDarkMode ) {
            this._darkMode = this.#getSystemDarkMode();
        }

        // user-defined dark mode is not set
        else if ( this._darkMode == null ) {
            if ( config.theme.darkMode === "auto" ) {
                this._darkMode = this.#getSystemDarkMode();
            }
            else {
                this._darkMode = !!config.theme.darkMode;
            }
        }
        else {
            this._darkMode = !!JSON.parse( this._darkMode );
        }

        // theme
        this.theme = window.localStorage.getItem( THEME_KEY );

        if ( this.theme == null ) {
            this.theme = DEFAULT_THEME;
        }
        else {
            this.theme = { ...DEFAULT_THEME, ...JSON.parse( this.theme ) };
        }

        this.#applyExtTheme();
    }

    // properties
    get systemDarkMode () {
        return this._systemDarkMode;
    }

    get darkMode () {
        return this._darkMode;
    }

    // public
    on ( name, listener ) {
        this.#events.on( name, listener );

        return this;
    }

    once ( name, listener ) {
        this.#events.once( name, listener );

        return this;
    }

    off ( name, listener ) {
        this.#events.off( name, listener );

        return this;
    }

    setSystemDarkMode ( systemDarkMode ) {
        this.#setSystemDarkMode( systemDarkMode );

        this.#setDarkMode( this.#getSystemDarkMode() );
    }

    setDarkMode ( darkMode ) {
        darkMode = !!darkMode;

        if ( darkMode === this._darkMode ) return;

        // turn off system dark mode
        this.#setSystemDarkMode( false );

        this.#setDarkMode( darkMode );
    }

    setTheme ( theme = {} ) {
        COMPARE: {
            for ( const property in theme ) {
                if ( theme[property] !== this.theme[property] ) break COMPARE;
            }

            // not changed
            return;
        }

        this.theme = { ...this.theme, ...theme };

        window.localStorage.setItem( THEME_KEY, JSON.stringify( this.theme ) );

        this.#applyExtTheme();

        this.#events.emit( "themeChange", this.theme );
    }

    // private
    #getSystemDarkMode () {
        return window.matchMedia && window.matchMedia( "(prefers-color-scheme: dark)" ).matches;
    }

    #setSystemDarkMode ( systemDarkMode ) {
        systemDarkMode = !!systemDarkMode;

        // not changed
        if ( systemDarkMode === this._systemDarkMode ) return;

        window.localStorage.setItem( SYSTEM_DARK_MODE_KEY, systemDarkMode );

        this._systemDarkMode = systemDarkMode;
    }

    #setDarkMode ( darkMode ) {
        darkMode = !!darkMode;

        // not changed
        if ( darkMode === this._darkMode ) return;

        window.localStorage.setItem( DARK_MODE_KEY, darkMode );

        this._darkMode = darkMode;

        this.#applyExtTheme();

        this.#events.emit( "darkModeChange", this._darkMode );
    }

    #applyExtTheme () {
        Ext.theme.Material.setColors( { ...this.theme, "darkMode": this._darkMode } );
    }
}

export default Store.new( "theme" );

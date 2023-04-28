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

Ext.manifest.material = Ext.manifest.material || {};
Ext.manifest.material.toolbar = Ext.manifest.material.toolbar || {};
Ext.manifest.material.toolbar.dynamic = true;

class Store extends VueStore {

    // state
    systemDarkMode;
    darkMode;
    theme;

    #events = new Events( { "maxListeners": Infinity } );

    constructor () {
        super();

        // listen for system dark mode change
        window.matchMedia( "(prefers-color-scheme: dark)" ).addEventListener( "change", e => {
            if ( !this.systemDarkMode ) return;

            this.#setDarkMode( e.matches );
        } );

        // darkMode
        this.systemDarkMode = window.localStorage.getItem( SYSTEM_DARK_MODE_KEY );
        this.darkMode = window.localStorage.getItem( DARK_MODE_KEY );

        // system dark mode is not set
        if ( this.systemDarkMode == null ) {

            // user-defined dark mode is set
            if ( this.darkMode != null ) {
                this.systemDarkMode = false;
            }

            // user-defined dark mode is not set
            else {

                // follow system dark mode
                if ( config.theme.darkMode === "auto" ) {
                    this.systemDarkMode = true;
                }

                // use user-defined dark mode
                else {
                    this.systemDarkMode = false;
                }
            }
        }
        else {
            this.systemDarkMode = !!JSON.parse( this.systemDarkMode );
        }

        // follow system dark mode settings
        if ( this.systemDarkMode ) {
            this.darkMode = this.#getSystemDarkMode();
        }

        // user-defined dark mode is not set
        else if ( this.darkMode == null ) {
            if ( config.theme.darkMode === "auto" ) {
                this.darkMode = this.#getSystemDarkMode();
            }
            else {
                this.darkMode = !!config.theme.darkMode;
            }
        }
        else {
            this.darkMode = !!JSON.parse( this.darkMode );
        }

        // theme
        this.theme = window.localStorage.getItem( THEME_KEY );

        if ( this.theme == null ) {
            this.theme = DEFAULT_THEME;
        }
        else {
            this.theme = { ...DEFAULT_THEME, ...JSON.parse( this.theme ) };
        }

        this.#applyTheme( { ...this.theme, "darkMode": this.darkMode } );
    }

    // public
    on ( event, listener ) {
        return this.#events.on( event, listener );
    }

    once ( event, listener ) {
        return this.#events.once( event, listener );
    }

    off ( event, listener ) {
        return this.#events.off( event, listener );
    }

    setSystemDarkMode ( systemDarkMode ) {
        this.#setSystemDarkMode( systemDarkMode );

        if ( this.systemDarkMode ) this.#setDarkMode( this.#getSystemDarkMode() );
    }

    setDarkMode ( darkMode ) {
        darkMode = !!darkMode;

        if ( darkMode === this.darkMode ) return;

        // turn off system dark mode
        this.#setSystemDarkMode( false );

        this.#setDarkMode( darkMode );
    }

    setTheme ( theme ) {
        this.theme = { ...this.theme, ...theme };

        window.localStorage.setItem( THEME_KEY, JSON.stringify( this.theme ) );

        this.#applyTheme( { ...this.theme, "darkMode": this.darkMode } );
    }

    // private
    #getSystemDarkMode () {
        return window.matchMedia && window.matchMedia( "(prefers-color-scheme: dark)" ).matches;
    }

    #setSystemDarkMode ( systemDarkMode ) {
        systemDarkMode = !!systemDarkMode;

        if ( systemDarkMode === this.systemDarkMode ) return;

        window.localStorage.setItem( SYSTEM_DARK_MODE_KEY, systemDarkMode );

        this.systemDarkMode = systemDarkMode;
    }

    #setDarkMode ( darkMode ) {
        darkMode = !!darkMode;

        if ( darkMode === this.darkMode ) return;

        window.localStorage.setItem( DARK_MODE_KEY, darkMode );

        this.darkMode = darkMode;

        this.#applyTheme( { ...this.theme, "darkMode": this.darkMode } );

        this.#events.emit( "darkMode", this.darkMode );
    }

    #applyTheme ( theme ) {
        Ext.theme.Material.setColors( theme );

        this.#events.emit( "theme", theme );
    }
}

export default Store.new( "theme" );

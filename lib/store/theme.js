import Store from "@softvisio/vue/store";
import themeRegistry from "#lib/theme";
import config from "#vue/config";

const DARK_MODE_KEY = "darkMode";
const SYSTEM_DARK_MODE_KEY = "systemDarkMode";
const THEME_KEY = "theme";
const DEFAULT_THEME = {
    "base": config.theme.baseColor,
    "accent": config.theme.accentColor,
};

export default class extends Store {

    // state
    systemDarkMode;
    darkMode;
    theme;

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
    }

    #applyTheme ( theme ) {
        Ext.theme.Material.setColors( theme );

        themeRegistry.theme = theme;
    }
}

import Store from ".";

Ext.manifest.material = Ext.manifest.material || {};
Ext.manifest.material.toolbar = Ext.manifest.material.toolbar || {};
Ext.manifest.material.toolbar.dynamic = true;

const DARK_MODE_KEY = "darkMode";
const THEME_KEY = "theme";
const DEFAULT_THEME = {
    "base": process.env.VUE_APP_THEME_BASE,
    "accent": process.env.VUE_APP_THEME_ACCENT,
};

export default class extends Store {

    // STATE
    darkMode;
    theme;

    constructor () {
        super();

        // darkMode
        this.darkMode = window.localStorage.getItem( DARK_MODE_KEY );

        // darkMode wasn't stored in localstorage
        if ( this.darkMode == null ) {

            // apply default dark mode
            this.darkMode = !!+process.env.VUE_APP_THEME_DARK_MODE || process.env.VUE_APP_THEME_DARK_MODE === "true" ? true : false;
        }
        else {
            this.darkMode = JSON.parse( this.darkMode );
        }

        // theme
        this.theme = window.localStorage.getItem( THEME_KEY );

        if ( this.theme == null ) {
            this.theme = DEFAULT_THEME;
        }
        else {
            this.theme = { ...DEFAULT_THEME, ...JSON.parse( this.theme ) };
        }

        this._applyTheme( { "darkMode": this.darkMode, ...this.theme } );
    }

    // PROTECTED
    _applyTheme ( theme ) {
        Ext.theme.Material.setColors( theme );
    }

    // MUTATIONS
    SET_darkMode ( state, darkMode ) {
        darkMode = !!darkMode;

        if ( state.darkMode === darkMode ) return;

        state.darkMode = darkMode;

        window.localStorage.setItem( DARK_MODE_KEY, darkMode );

        this._applyTheme( { "darkMode": darkMode, ...state.theme } );
    }

    SET_theme ( state, theme ) {
        state.theme = { ...state.theme, ...theme };

        window.localStorage.setItem( THEME_KEY, JSON.stringify( state.theme ) );

        this._applyTheme( { "darkMode": state.darkMode, ...state.theme } );
    }
}

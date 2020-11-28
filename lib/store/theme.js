import Store from "#softvisio/store";

Ext.manifest.material = Ext.manifest.material || {};
Ext.manifest.material.toolbar = Ext.manifest.material.toolbar || {};
Ext.manifest.material.toolbar.dynamic = true;

const DARK_MODE_KEY = "darkMode";
const THEME_KEY = "theme";
const DEFAULT_THEME = {
    "base": process.env.VUE_APP_THEME_BASE,
    "accent": process.env.VUE_APP_THEME_ACCENT,
};

function applyTheme ( theme ) {
    Ext.theme.Material.setColors( theme );
}

export default class extends Store {
    #darkMode;

    #theme;

    namespaced = true;

    constructor () {
        super();

        // darkMode
        this.#darkMode = window.localStorage.getItem( DARK_MODE_KEY );

        // darkMode wasn't stored in localstorage
        if ( this.#darkMode == null ) {

            // apply default dark mode
            this.#darkMode = !!+process.env.VUE_APP_THEME_DARK_MODE || process.env.VUE_APP_THEME_DARK_MODE === "true" ? true : false;
        }
        else {
            this.#darkMode = JSON.parse( this.#darkMode );
        }

        // theme
        this.#theme = window.localStorage.getItem( THEME_KEY );

        if ( this.#theme == null ) {
            this.#theme = DEFAULT_THEME;
        }
        else {
            this.#theme = { ...DEFAULT_THEME, ...JSON.parse( this.#theme ) };
        }

        applyTheme( { "darkMode": this.#darkMode, ...this.#theme } );
    }

    state () {
        return {

            // theme
            "darkMode": this.#darkMode,

            "theme": this.#theme,
        };
    }

    getters () {
        return {
            darkMode ( state ) {
                return state.darkMode;
            },

            theme ( state ) {
                return state.theme;
            },
        };
    }

    mutations () {
        return {
            darkMode ( state, darkMode ) {
                state.darkMode = darkMode;
            },

            theme ( state, theme ) {
                state.theme = { ...state.theme, ...theme };
            },
        };
    }

    actions () {
        return {
            invertDarkMode ( ctx ) {
                ctx.dispatch( "setDarkMode", !ctx.state.darkMode );
            },

            setDarkMode ( ctx, darkMode ) {
                ctx.commit( "darkMode", darkMode );

                window.localStorage.setItem( DARK_MODE_KEY, darkMode );

                ctx.dispatch( "refreshTheme" );
            },

            setTheme ( ctx, theme ) {
                ctx.commit( "theme", theme );

                window.localStorage.setItem( THEME_KEY, JSON.stringify( ctx.state.theme ) );

                ctx.dispatch( "refreshTheme" );
            },

            refreshTheme ( ctx ) {
                applyTheme( { "darkMode": ctx.state.darkMode, ...ctx.state.theme } );
            },
        };
    }
}

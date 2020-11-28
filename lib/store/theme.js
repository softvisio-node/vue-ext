import Store from "#softvisio/store";

Ext.manifest.material = Ext.manifest.material || {};
Ext.manifest.material.toolbar = Ext.manifest.material.toolbar || {};
Ext.manifest.material.toolbar.dynamic = true;

const keyDarkMode = "darkMode";
const keyTheme = "theme";

function applyTheme ( theme ) {
    Ext.theme.Material.setColors( theme );
}

export default class extends Store {
    #darkMode = false;

    #theme = {
        "accent": null,
        "base": null,
    };

    namespaced = true;

    constructor () {
        super();

        // darkMode
        var darkMode = window.localStorage.getItem( keyDarkMode );

        // darkMode wasn't stored in localstorage
        if ( darkMode == null ) {

            // apply default dark mode
            this.#darkMode = !!+process.env.VUE_APP_THEME_DARK_MODE || process.env.VUE_APP_THEME_DARK_MODE === "true" ? true : false;
        }
        else {
            this.#darkMode = JSON.parse( darkMode );
        }

        // theme
        var theme = window.localStorage.getItem( keyTheme );

        var defaultTheme = {
            "base": process.env.VUE_APP_THEME_BASE,
            "accent": process.env.VUE_APP_THEME_ACCENT,
        };

        if ( theme == null ) {
            this.#theme = defaultTheme;
        }
        else {
            this.#theme = { ...defaultTheme, ...JSON.parse( theme ) };
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

                window.localStorage.setItem( keyDarkMode, darkMode );

                ctx.dispatch( "refreshTheme" );
            },

            setTheme ( ctx, theme ) {
                ctx.commit( "theme", theme );

                window.localStorage.setItem( keyTheme, JSON.stringify( ctx.state.theme ) );

                ctx.dispatch( "refreshTheme" );
            },

            refreshTheme ( ctx ) {
                applyTheme( { "darkMode": ctx.state.darkMode, ...ctx.state.theme } );
            },
        };
    }
}

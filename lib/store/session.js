const keyToken = "token";
const keyTheme = "theme";

var state = {
    "isInitialized": false,
    "isAuthenticated": false,

    // user
    "userId": null,
    "userName": null,
    "avatar": null,
    "permissions": null,

    // settings
    "settings": {},

    // theme
    "theme": {
        "darkMode": false,
        "accent": null,
        "base": null,
    },
};

var getters = {
    isAuthenticated ( state ) {
        // if is not initialized - authentication status is unknown
        return !state.isInitialized ? null : state.isAuthenticated;
    },

    userId ( state ) {
        return state.userId;
    },

    userName ( state ) {
        return state.userName;
    },

    avatar ( state ) {
        return state.avatar;
    },

    darkMode ( state ) {
        return state.theme.darkMode;
    },

    isRoot ( state ) {
        return state.userId === 1;
    },

    "hasPermissions": ( state ) => ( permissions ) => {
        return false;

        // no permissions, authorization is not required
        if ( !permissions ) return true;

        if ( Ext.isArray( permissions ) ) {
            // no permissions, authorization is not required
            if ( !permissions.length ) return true;

            // compare permissions for authenticated session only
            if ( state.isAuthenticated ) {
                // compare permissions
                for ( const permission of permissions ) {
                    if ( permission === "*" ) return true;

                    if ( state.permissions[permission] ) return true;
                }
            }
        }
        else {
            if ( permissions === "*" && state.isAuthenticated ) return true;

            if ( state.permissions[permissions] ) return true;
        }

        return false;
    },
};

var mutations = {
    darkMode ( state, darkMode ) {
        state.theme.darkMode = darkMode;

        var theme = state.theme;

        this.commit( "session/theme", { ...theme, "darkMode": darkMode } );
    },

    invertDarkMode ( state ) {
        this.commit( "session/darkMode", !state.theme.darkMode );
    },

    theme ( state, theme ) {
        theme = { ...state.theme, ...theme };

        if ( Ext ) {
            Ext.manifest.material = Ext.manifest.material || {};
            Ext.manifest.material.toolbar = Ext.manifest.material.toolbar || {};
            Ext.manifest.material.toolbar.dynamic = true;

            Ext.theme.Material.setColors( theme );
        }

        window.localStorage.setItem( keyTheme, JSON.stringify( theme ) );

        state.theme = theme;
    },

    _session ( state, data ) {
        if ( data && data.is_authenticated ) {
            state.isAuthenticated = true;
            state.userId = data.user_id;
            state.userName = data.user_name;
            state.avatar = data.avatar;
            state.permissions = data.permissions;

            state.settings = data.settings;

            if ( data.token ) {
                // store token
                window.localStorage.setItem( keyToken, data.token );

                // re-authenticate
                this._vm.$api.auth( data.token );
            }
        }
        else {
            state.isAuthenticated = false;
            state.userId = null;
            state.userName = null;
            state.avatar = null;
            state.permissions = null;
        }
    },
};

var actions = {
    init ( ctx, defaults ) {
        // api
        var token = window.localStorage.getItem( keyToken );

        this._vm.$api.auth( token );

        // theme
        var theme = window.localStorage.getItem( keyTheme );

        if ( theme ) {
            ctx.commit( "theme", { ...defaults.theme, ...JSON.parse( theme ) } );
        }
        else {
            ctx.commit( "theme", defaults.theme );
        }
    },

    async signin ( ctx, credintials ) {
        var res = await this._vm.$api.call( "session/signin", credintials );

        if ( !ctx.state.isInitialized && res.isSuccess() ) ctx.state.isInitialized = true;

        ctx.commit( "_session", res.data );

        return res;
    },

    async signout ( ctx ) {
        // signout
        await this._vm.$api.call( "session/signout" );

        // drop API token
        window.localStorage.removeItem( keyToken );

        // set token and disconnect
        this._vm.$api.auth( null );

        // clear session data
        ctx.commit( "_session" );
    },

    async changePassword ( ctx, password ) {
        var res = await this._vm.$api.call( "profile/change-password", password );

        return res;
    },

    async signup ( ctx, data ) {
        var res = await this._vm.$api.call( "session/signup", data );

        return res;
    },

    async recoverPassword ( ctx, username ) {
        var res = await this._vm.$api.call( "session/recover-password", username );

        return res;
    },

    async setPassword ( ctx, args ) {
        var res = await this._vm.$api.call( "session/set-password", ...args );

        return res;
    },
};

export default {
    "namespaced": true,
    state,
    getters,
    mutations,
    actions,
};
// -----SOURCE FILTER LOG BEGIN-----
//
// +-------+---------------+------------------------------+--------------------------------------------------------------------------------+
// | Sev.  | Line:Col      | Rule                         | Description                                                                    |
// |=======+===============+==============================+================================================================================|
// | ERROR | 55:9          | no-unreachable               | Unreachable code.                                                              |
// +-------+---------------+------------------------------+--------------------------------------------------------------------------------+
//
// -----SOURCE FILTER LOG END-----

import locale from "#vue/locale";

export default Ext.define( "", {
    "extend": "Ext.data.Model",

    "fields": [
        { "name": "id", "type": "string" },

        // fields
        { "name": "avatar", "type": "string" },
        { "name": "username", "type": "string" },
        { "name": "enabled", "type": "bool" },
        { "name": "enabled_readonly", "type": "bool" },
        { "name": "roles", "type": "array" },

        // calculated
        {
            "name": "roles_text",
            calculate ( data ) {
                const enabledRoles = data.roles.filter( role => role.enabled ).map( role => role.name );

                if ( !enabledRoles.length ) return locale.i18nd( "vue-ext", `No roles assigned` );

                return enabledRoles.join( ", " );
            },
        },
    ],
} );

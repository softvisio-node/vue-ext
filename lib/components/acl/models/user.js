import locale from "#vue/locale";

export default Ext.define( "", {
    "extend": "Ext.data.Model",

    "proxy": {
        "api": {
            "read": "acl/read-acl-users",
        },
    },

    "fields": [
        { "name": "id", "type": "string" },

        // fields
        { "name": "acl_id", "type": "string" },
        { "name": "email", "type": "string" },
        { "name": "avatar", "type": "string" },
        { "name": "created", "type": "date" },
        { "name": "enabled", "type": "bool" },
        { "name": "scopes", "type": "array" },

        // calculated
        {
            "name": "scopes_text",
            calculate ( data ) {
                const scopes = ( data.scopes || [] ).join( ", " );

                if ( !scopes ) return locale.i18nd( "vue-ext", `No scopes assigned` );

                return scopes;
            },
        },
    ],
} );

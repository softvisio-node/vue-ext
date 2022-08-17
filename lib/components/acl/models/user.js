import locale from "#vue/locale";

export default Ext.define( "", {
    "extend": "Ext.data.Model",

    "fields": [
        { "name": "id", "type": "string" },

        // fields
        { "name": "avatar", "type": "string" },
        { "name": "username", "type": "string" },
        { "name": "enabled", "type": "bool" },
        { "name": "readonly", "type": "bool" },
        { "name": "roles", "type": "array" },
        { "name": "acl_permissions", "defaultValue": {} },

        // permissions
        { "name": "can_set_enabled", "calculate": data => !data.readonly && !!data.acl_permissions["/v1/acl/set-user-enabled"] },
        { "name": "can_delete", "calculate": data => !!data.acl_permissions["/v1/acl/delete-user"] },
        { "name": "can_edit_roles", "calculate": data => !!data.acl_permissions["/v1/acl/set-role-enabled"] },

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

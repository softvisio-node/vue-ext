import locale from "#vue/locale";

export default Ext.define( "", {
    "extend": "Ext.data.Model",

    "fields": [
        { "name": "id", "type": "string" },

        // fields
        { "name": "avatar", "type": "string" },
        { "name": "email", "type": "string" },
        { "name": "enabled", "type": "bool" },
        { "name": "readonly", "type": "bool" },
        { "name": "roles", "type": "array", "defaultValue": [] },
        { "name": "editor_acl_permissions", "defaultValue": {} },

        // permissions
        { "name": "can_set_enabled", "calculate": data => !data.readonly && !!data.editor_acl_permissions["/v1/acl/set-user-enabled"] },
        { "name": "can_delete", "calculate": data => !!data.editor_acl_permissions["/v1/acl/delete-user"] },
        { "name": "can_edit_roles", "calculate": data => !!data.editor_acl_permissions["/v1/acl/set-role-enabled"] },

        // calculated
        {
            "name": "roles_text",
            calculate ( data ) {
                const enabledRoles = [];

                for ( const role of data.roles ) {
                    if ( !role.enabled ) continue;

                    enabledRoles.push( role.name );
                }

                if ( !enabledRoles.length ) return locale.i18nd( "vue-ext", `No roles assigned` );

                return enabledRoles.join( ", " );
            },
        },
    ],
} );

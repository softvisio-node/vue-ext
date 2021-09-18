import * as utils from "#vue/utils";

export default Ext.define( "", {
    "extend": "Ext.data.Model",

    "proxy": {

        // "api": {
        //     "create": "admin/users/create",
        //     "read": "admin/users/read",
        //     "update": "admin/users/update",
        //     "destroy": "admin/users/delete",
        // },
    },

    "fields": [
        { "name": "id", "type": "string" },

        //
        { "name": "date", "type": "date" },
        "subject",
        "body",

        { "name": "relative_time", "persist": false },
    ],

    refreshRelativeTime () {
        this.set( "relative_time", utils.relativeTime( this.get( "date" ) - new Date() ) );
    },
} );

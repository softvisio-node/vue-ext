<script>
import UserSessionsDialog from "#lib/components/user-sessions/dialog";
import SessionModel from "#lib/components/user-sessions/models/session";

export default {
    "extends": UserSessionsDialog,

    "props": {
        "userId": {
            "type": String,
            "required": true,
        },
        "username": {
            "type": String,
            "required": true,
        },
    },

    // XXX
    "computed": {
        header () {
            return this.i18nd( "vue-ext", `Change password for user` ) + `<br/><b>${this.username}</b>`;
        },
    },

    "methods": {
        _createStore () {
            this.store = Ext.create( "Ext.data.Store", {
                "model": SessionModel,
                "autoLoad": false,
                "pageSize": null,
                "remoteSort": false,
                "remoteFilter": false,
            } );
        },

        async _signoutSessionRequest ( sessionId ) {
            return this.$api.call( "admin/users/delete-session", this.userId, sessionId );
        },

        async _deleteAllSessionsRequest ( e ) {
            return this.$api.call( "admin/users/delete-all-sessions", this.userId );
        },
    },
};
</script>

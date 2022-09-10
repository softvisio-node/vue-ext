<script>
import UserSessionsPanel from "#lib/components/user-sessions/panel";

export default {
    "extends": UserSessionsPanel,

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

    "computed": {
        title () {
            return this.username;
        },
    },

    "methods": {
        async _loadSessions () {
            return this.$api.call( "admin/users/get-sessions", this.userId );
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

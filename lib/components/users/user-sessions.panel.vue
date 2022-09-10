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

    // XXX
    "computed": {
        header () {
            return this.i18nd( "vue-ext", `Change password for user` ) + `<br/><b>${this.username}</b>`;
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

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
            return this.i18nd( "vue-ext", "Username" ) + ": " + this.username;
        },
    },

    "methods": {
        async _loadSessions () {
            return this.$api.call( "admin/users/get-sessions", this.userId );
        },

        async _signOutSessionRequest ( sessionId ) {
            return this.$api.call( "admin/users/signout-session", this.userId, sessionId );
        },

        async _signOutAllSessionsRequest ( e ) {
            return this.$api.call( "admin/users/sign-out-all-sessions", this.userId );
        },
    },
};
</script>

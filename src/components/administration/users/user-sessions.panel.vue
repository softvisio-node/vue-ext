<script>
import UserSessionsPanel from "#src/components/user-sessions/panel";

export default {
    "extends": UserSessionsPanel,

    "props": {
        "userId": {
            "type": String,
            "required": true,
        },
        "userEmail": {
            "type": String,
            "required": true,
        },
    },

    "computed": {
        title () {
            return this.l10n( "User" ) + ": " + this.userEmail;
        },
    },

    "methods": {
        async _loadSessions () {
            return this.$api.call( "administration/users/get-sessions", this.userId );
        },

        async _signOutSessionRequest ( sessionId ) {
            return this.$api.call( "administration/users/sign-out-session", this.userId, sessionId );
        },

        async _signOutAllSessionsRequest ( e ) {
            return this.$api.call( "administration/users/sign-out-all-sessions", this.userId );
        },
    },
};
</script>

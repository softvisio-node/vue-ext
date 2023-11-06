<template>
    <UserSessionsPanel>
        <template #user>
            <ext-container layout='{"align":"center","pack":"center","type":"hbox"}'>
                <ext-avatar :src="userRecord?.get(`avatar_url`)"/>
                <ext-spacer width="10"/>
                <ext-container :html="userRecord?.get(`email`)"/>
            </ext-container>
        </template>
    </UserSessionsPanel>
</template>

<script>
import UserSessionsPanel from "#src/components/user-sessions/panel";

export default {
    "components": { UserSessionsPanel },
    "extends": UserSessionsPanel,

    "props": {
        "userRecord": {
            "type": Object,
            "required": true,
        },
    },

    "methods": {
        async _loadSessions () {
            return this.$api.call( "administration/users/get-sessions", this.userRecord.id );
        },

        async _signOutSessionRequest ( sessionId ) {
            return this.$api.call( "administration/users/sign-out-session", this.userRecord.id, sessionId );
        },

        async _signOutAllSessionsRequest ( e ) {
            return this.$api.call( "administration/users/sign-out-all-sessions", this.userRecord.id );
        },
    },
};
</script>

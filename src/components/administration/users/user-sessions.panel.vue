<template>
    <UserSessionsPanel>
        <template #user>
            <ext-container :hidden="!userRecord" layout='{"align":"center","pack":"center","type":"hbox"}'>
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
        "userId": {
            "type": String,
            "required": true,
        },
        "userRecord": {
            "type": Object,
            "required": true,
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

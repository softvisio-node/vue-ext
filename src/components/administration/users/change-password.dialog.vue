<template>
    <ChangePasswordDialog>
        <template #header>
            <ext-container :hidden="!userRecord" layout='{"align":"center","pack":"center","type":"hbox"}'>
                <ext-avatar :src="userRecord?.get(`avatar_url`)"/>
                <ext-spacer width="10"/>
                <ext-container :html="userRecord?.get(`email`)"/>
            </ext-container>
        </template>
    </ChangePasswordDialog>
</template>

<script>
import ChangePasswordDialog from "#src/components/change-password.dialog";

export default {
    "components": { ChangePasswordDialog },
    "extends": ChangePasswordDialog,

    "props": {
        "userId": {
            "type": String,
            "required": true,
        },
        "userRecord": {
            "type": Object,
            "default": null,
        },
    },

    "methods": {
        async _changePassword ( password ) {
            return this.$api.call( "administration/users/set-password", this.userId, password );
        },
    },
};
</script>

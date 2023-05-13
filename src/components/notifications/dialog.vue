<template>
    <ext-dialog closeAction="hide" height="80%" iconCls="fa-regular fa-bell" layout="fit" :title="i18nd(`vue-ext`, `Notifications settings`)" width="700" @ready="_ready">
        <NotificationsPanel/>
    </ext-dialog>
</template>

<script>
import NotificationsPanel from "#src/components/notifications/panel";

export default {
    "components": { NotificationsPanel },

    "methods": {
        _ready ( e ) {
            this.ext = e.detail.cmp;
        },
    },
};
</script>

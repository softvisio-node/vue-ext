<template>
    <ext-dialog closeAction="hide" height="90%" layout="fit" padding="0 5 5 5" :title="i18nd(`vue-ext`, `Notifications`)" width="600" @ready="_ready">
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

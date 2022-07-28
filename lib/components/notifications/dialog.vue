<template>
    <ext-dialog height="90%" layout="fit" :title="i18nd(`vue-ext`, `Notifications settings`)" width="700">
        <NotificationsPanel/>
    </ext-dialog>
</template>

<script>
import NotificationsPanel from "#lib/components/notifications/panel";

export default {
    "components": { NotificationsPanel },

    "methods": {},
};
</script>

<template>
    <ext-dialog :title="i18n(`Notifications settings`)" width="700" height="90%" layout="fit">
        <NotificationsPanel/>
    </ext-dialog>
</template>

<script>
import NotificationsPanel from "#components/notifications/panel";

export default {
    "components": { NotificationsPanel },

    "methods": {},
};
</script>

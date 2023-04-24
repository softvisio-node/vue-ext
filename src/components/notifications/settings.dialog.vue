<template>
    <ext-dialog height="90%" layout="fit" :title="i18nd(`vue-ext`, `Notifications settings`)" width="700">
        <NotificationsSettingsPanel/>
    </ext-dialog>
</template>

<script>
import NotificationsSettingsPanel from "#src/components/notifications/settings.panel";

export default {
    "components": { NotificationsSettingsPanel },

    "methods": {},
};
</script>

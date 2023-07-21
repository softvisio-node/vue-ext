<template>
    <ext-dialog height="500" layout="fit" :title="i18nd(`vue-ext`, `Notifications settings`)" width="700">
        <NotificationsSettingsPanel :aclId="aclId"/>
    </ext-dialog>
</template>

<script>
import NotificationsSettingsPanel from "#src/components/notifications/settings.panel";

export default {
    "components": { NotificationsSettingsPanel },

    "props": {
        "aclId": {
            "type": String,
            "default": "",
        },
    },

    "methods": {},
};
</script>

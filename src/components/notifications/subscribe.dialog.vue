<template>
    <ext-dialog closeAction="hide" height="300" layout="fit" padding="0 5 5 5" :title="i18nd(`vue-ext`, `Notifications`)" width="300" @ready="_ready">
        <NotificationsSubscribePanel ref="panel" :aclId="aclId"/>
    </ext-dialog>
</template>

<script>
import NotificationsSubscribePanel from "#src/components/notifications/subscribe.panel";

export default {
    "components": { NotificationsSubscribePanel },

    "props": {
        "aclId": {
            "type": String,
            "default": "",
        },
    },

    "methods": {
        _ready ( e ) {
            this.ext = e.detail.cmp;

            this.ext.on( "beforeShow", () => this.$refs.panel.refresh() );
        },
    },
};
</script>

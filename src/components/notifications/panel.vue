<template>
    <ext-tabpanel flex="1" layout='{"animation":{"direction":"vertical","type":"slide"}}' tabBar='{"defaults":{"flex":null,"height":"100"},"layout":{"align":"start","pack":"start","type":"vbox"}}' tabBarPosition="left" @ready="_ready">
        <!-- inbox             -->
        <ext-panel layout="fit" :title="i18nd(`vue-ext`, `Inbox`)">
            <InboxPanel/>
        </ext-panel>

        <!-- done -->
        <ext-panel iconAlign="left" iconCls="fa-solid fa-check" layout="fit" :title="i18nd(`vue-ext`, `Done`)">
            <DonePanel/>
        </ext-panel>
    </ext-tabpanel>
</template>

<script>
import InboxPanel from "#src/components/notifications/inbox.panel";
import DonePanel from "#src/components/notifications/done.panel";
import notificationsStore from "#src/components/notifications/store";

export default {
    "components": { InboxPanel, DonePanel },

    "computed": {
        totalUndone () {
            return notificationsStore.totalUndone;
        },
    },

    "watch": {
        "totalUndone": "_setNotificationsBadgeText",
    },

    "methods": {
        _ready ( e ) {
            this._inboxTab = e.detail.cmp.getTabBar().getTabs()[0];

            this._setNotificationsBadgeText();
        },

        _setNotificationsBadgeText () {
            this._inboxTab.setBadgeText( notificationsStore.totalUndone || "" );
        },
    },
};
</script>

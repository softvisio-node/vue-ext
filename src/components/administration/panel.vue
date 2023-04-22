<template>
    <ext-tabpanel defaults='{"padding":"0 10 0 10"}' layout='{"animation":{"direction":"vertical","type":"slide"}}' tabBar='{"defaults":{"flex":null,"height":40,"padding":"0 10 0 0","textAlign":"right","width":200},"layout":{"align":"start","pack":"start","type":"vbox"}}' tabBarPosition="left" tabRotation="none" @ready="_ready">
        <slot name="top"/>

        <!-- users -->
        <ext-panel iconAlign="left" iconCls="fa-solid fa-users" layout="fit" :title="i18nd(`vue-ext`, `Users`)">
            <UsersPanel/>
        </ext-panel>

        <!-- notifications -->
        <ext-panel layout="fit" :title="i18nd(`vue-ext`, `Notifications`)">
            <NotificationsPanel/>
        </ext-panel>

        <!-- tokens -->
        <ext-panel iconAlign="left" iconCls="fa-solid fa-key" layout="fit" :title="i18nd(`vue-ext`, `Access tokens`)">
            <UserTokensPanel/>
        </ext-panel>

        <slot name="bottom"/>
    </ext-tabpanel>
</template>

<script>
import UsersPanel from "#src/components/users/panel";
import NotificationsPanel from "#src/components/notifications/panel";
import UserTokensPanel from "#src/components/user-tokens/panel";

export default {
    "components": { UsersPanel, NotificationsPanel, UserTokensPanel },

    "methods": {
        _ready ( e ) {

            // const cmp = e.detail.cmp;
        },
    },
};
</script>

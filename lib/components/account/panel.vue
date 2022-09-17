<template>
    <ext-tabpanel defaults='{"padding":"0 10 0 10"}' layout='{"animation":{"direction":"vertical","type":"slide"}}' tabBar='{"defaults":{"flex":null,"height":40,"padding":"0 10 0 0","textAlign":"right","width":170},"layout":{"align":"start","pack":"start","type":"vbox"}}' tabBarPosition="left" tabRotation="none" @ready="_ready">
        <slot name="top"/>

        <!-- security -->
        <ext-panel layout="vbox" :title="i18nd(`vue-ext`, `Security`)">
            <SecurityPanel/>
        </ext-panel>

        <!-- notifications -->
        <ext-panel layout="fit" :title="i18nd(`vue-ext`, `Notifications`)">
            <NotificationsPanel/>
        </ext-panel>

        <!-- tokens -->
        <ext-panel layout="fit" :title="i18nd(`vue-ext`, `Access tokens`)">
            <UserTokensPanel/>
        </ext-panel>

        <!-- theme -->
        <ext-panel layout="vbox" :title="i18nd(`vue-ext`, `Interface theme`)" viewModel="true">
            <ext-toolbar docked="top">
                <ext-container :html="i18nd(`vue-ext`, `Interface theme`)"/>
            </ext-toolbar>

            <ThemePanel/>
        </ext-panel>

        <slot name="bottom"/>
    </ext-tabpanel>
</template>

<script>
import SecurityPanel from "./security.panel";
import NotificationsPanel from "#lib/components/notifications/panel";
import UserTokensPanel from "#lib/components/user-tokens/panel";
import ThemePanel from "./theme.panel";

export default {
    "components": { SecurityPanel, NotificationsPanel, UserTokensPanel, ThemePanel },

    "methods": {
        _ready ( e ) {
            const cmp = e.detail.cmp,
                tabBar = cmp.getTabBar();

            tabBar.add( [
                {
                    "xtype": "container",
                    "layout": "center",
                    "margin": "10 0 20 0",
                    "height": 70,
                    "docked": "top",
                    "items": [
                        {
                            "xtype": "avatar",
                            "src": this.$store.session.avatar,
                            "width": 60,
                            "height": 60,
                        },
                    ],
                },
            ] );
        },
    },
};
</script>

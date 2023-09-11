<template>
    <ext-tabpanel defaults='{"padding":"0 10 0 10"}' layout='{"animation":{"direction":"vertical","type":"slide"}}' tabBar='{"defaults":{"flex":null,"height":40,"padding":"0 10 0 0","textAlign":"right","width":200},"layout":{"align":"start","pack":"start","type":"vbox"}}' tabBarPosition="left" tabRotation="none">
        <!-- users -->
        <ext-panel layout="fit" :title="l10n(`Users`)">
            <UsersPanel/>
        </ext-panel>

        <!-- telegram -->
        <ext-panel :hidden="!$app.settings.components.has('telegram')" iconAlign="left" iconCls="fa-brands fa-telegram" layout="fit" title="Telegram">
            <TelegramPanel/>
        </ext-panel>

        <slot name="tabs"/>
    </ext-tabpanel>
</template>

<script>
import UsersPanel from "./users/panel";
import TelegramPanel from "./telegram/panel";

export default {
    "components": { UsersPanel, TelegramPanel },
};
</script>

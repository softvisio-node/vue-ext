<template>
    <ext-tabpanel defaults='{"padding":"0 10 0 10"}' layout='{"animation":{"direction":"vertical","type":"slide"}}' tabBar='{"defaults":{"flex":null,"height":40,"padding":"0 10 0 0","textAlign":"right","width":200},"layout":{"align":"start","pack":"start","type":"vbox"}}' tabBarPosition="left" tabRotation="none">
        <!-- api status -->
        <ext-panel layout="fit" :title="i18nd(`vue-ext`, `API status`)">
            <ApiStatusPanel/>
        </ext-panel>

        <slot name="tabs"/>
    </ext-tabpanel>
</template>

<script>
import ApiStatusPanel from "./api-status/panel";

export default {
    "components": { ApiStatusPanel },
};
</script>

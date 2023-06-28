<template>
    <ext-tabpanel defaults='{"padding":"0 10 0 10"}' layout='{"animation":{"direction":"vertical","type":"slide"}}' tabBar='{"defaults":{"flex":null,"height":40,"padding":"0 10 0 0","textAlign":"right","width":200},"layout":{"align":"start","pack":"start","type":"vbox"}}' tabBarPosition="left" tabRotation="none">
        <!-- instances monitoring -->
        <ext-panel layout="fit" :title="i18nd(`vue-ext`, `Instances monitoring`)">
            <InstancesMonitoringPanel/>
        </ext-panel>

        <!-- methods monitoring -->
        <ext-panel layout="fit" :title="i18nd(`vue-ext`, `Methods monitoring`)">
            <MethodsMonitoringPanel/>
        </ext-panel>

        <slot name="tabs"/>
    </ext-tabpanel>
</template>

<script>
import InstancesMonitoringPanel from "./monitoring/instances/panel";
import MethodsMonitoringPanel from "./monitoring/methods/panel";

export default {
    "components": { InstancesMonitoringPanel, MethodsMonitoringPanel },
};
</script>

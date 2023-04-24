<template>
    <ext-tabpanel defaults='{"padding":"0 10 0 10"}' layout='{"animation":{"direction":"vertical","type":"slide"}}' tabBar='{"defaults":{"flex":null,"height":40,"padding":"0 10 0 0","textAlign":"right","width":200},"layout":{"align":"start","pack":"start","type":"vbox"}}' tabBarPosition="left" tabRotation="none" @ready="_ready">
        <!-- users -->
        <ext-panel layout="fit" :title="i18nd(`vue-ext`, `Users`)">
            <UsersPanel/>
        </ext-panel>

        <!-- api call log -->
        <ext-panel :hidden="!apiCallLogEnabled" layout="fit" :title="i18nd(`vue-ext`, `API call log`)">
            <ApiCallLogPanel/>
        </ext-panel>

        <slot name="tabs"/>
    </ext-tabpanel>
</template>

<script>
import UsersPanel from "#src/components/users/panel";
import ApiCallLogPanel from "#src/components/api-status/panel";

export default {
    "components": { UsersPanel, ApiCallLogPanel },

    "props": {
        "apiCallLogEnabled": {
            "type": Boolean,
            "default": true,
        },
    },

    "methods": {
        _ready ( e ) {

            // const cmp = e.detail.cmp;
        },
    },
};
</script>

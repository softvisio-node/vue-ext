<template>
    <ext-togglefield :disabled="disabled" :label="label" :labelAlign="labelAlign" :labelTextAlign="labelTextAlign" :labelWidth="labelWidth" :value="value" @change="value = $event"/>
</template>

<script>
import themeStore from "#vue/stores/theme";

export default {
    "props": {
        "labelAlign": {
            "type": String,
            "default": "left",
        },
        "labelTextAlign": {
            "type": String,
            "default": "left",
        },
        "labelWidth": {
            "type": String,
            "default": null,
        },
        "disabled": {
            "type": Boolean,
            "default": false,
        },
    },

    "computed": {
        label () {
            return this.i18nd( `vue-ext`, `Use OS theme` );
        },

        "value": {
            get () {
                return themeStore.systemDarkMode || null;
            },

            set ( e ) {
                themeStore.setSystemDarkMode( e.detail.newValue );
            },
        },
    },
};
</script>

<template>
    <ext-togglefield ref="button" :disabled="disabled" :label="label" :labelAlign="labelAlign" :labelTextAlign="labelTextAlign" :labelWidth="labelWidth" @change="_onChange" @ready="_ready"/>
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

        darkMode () {
            return themeStore.systemDarkMode;
        },
    },

    "watch": {
        systemDarkMode ( value ) {
            this.$refs.button.ext.setValue( value );
        },
    },

    "methods": {
        _ready () {
            this.$refs.button.ext.setValue( this.darkMode );
        },

        _onChange ( e ) {
            themeStore.systemDarkMode = e.detail.newValue;
        },
    },
};
</script>

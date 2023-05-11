<template>
    <ext-togglefield ref="button" :disabled="disabled" :label="label" :labelAlign="labelAlign" :labelTextAlign="labelTextAlign" :labelWidth="labelWidth" @change="_onChange" @ready="_ready"/>
</template>

<script>
import themeStore from "#vue/stores/theme";

export default {
    "props": {
        "hideLabel": {
            "type": Boolean,
            "default": false,
        },
        "hideLabelText": {
            "type": Boolean,
            "default": false,
        },
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
            if ( this.hideLabel ) {
                return "";
            }
            else if ( this.hideLabelText ) {
                return `<i class="fa-solid fa-adjust"></i>`;
            }
            else {
                return `<i class="fa-solid fa-adjust"></i> ${this.i18nd( `vue-ext`, `Dark mode` )}`;
            }
        },

        darkMode () {
            return themeStore.darkMode;
        },
    },

    "watch": {
        darkMode ( value ) {
            this.$refs.button.ext.setValue( value );
        },
    },

    "methods": {
        _ready () {
            this.$refs.button.ext.setValue( this.darkMode );
        },

        _onChange ( e ) {
            themeStore.darkMode = e.detail.newValue;
        },
    },
};
</script>

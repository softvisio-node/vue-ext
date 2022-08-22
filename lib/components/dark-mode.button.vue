<template>
    <ext-togglefield :disabled="disabled" :label="label" :labelAlign="labelAlign" :labelTextAlign="labelTextAlign" :labelWidth="labelWidth" :value="value" @change="value = $event"/>
</template>

<script>
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
            "type": Number,
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
        "value": {
            get () {
                return this.$store.theme.darkMode + "";
            },

            set ( e ) {
                this.$store.theme.setDarkMode( e.detail.newValue );
            },
        },
    },
};
</script>

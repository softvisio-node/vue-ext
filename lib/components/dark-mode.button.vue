<template>
    <ext-togglefield :boxLabel="label" :boxLabelAlign="boxLabelAlign" :value="darkMode" @change="darkMode = $event"/>
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
        "boxLabelAlign": {
            "type": String,
            "default": "after", // before, after
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
        "darkMode": {
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

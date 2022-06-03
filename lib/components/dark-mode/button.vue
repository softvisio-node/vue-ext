<template>
    <ext-togglefield :label="darkModeLabel" :labelAlign="labelAlign" labelWidth="120" :value="darkMode" :disabled="systemDarkMode" @change="darkMode = $event"/>
</template>

<script>
export default {
    "props": {
        "labelAlign": {
            "type": String,
            "default": "left",
        },
    },
    data () {
        return {
            "darkModeLabel": `<i class="fa-solid fa-adjust"></i> ${this.i18n( `Dark Mode` )}`,
        };
    },

    "computed": {
        "systemDarkMode": {
            get () {
                return this.$store.theme.systemDarkMode;
            },
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

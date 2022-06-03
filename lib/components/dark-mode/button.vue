<template>
    <ext-togglefield :label="darkModeLabel" :value="darkMode" :disabled="systemDarkMode" @change="darkMode = $event"/>
</template>

<script>
export default {
    data () {
        return {
            "darkModeLabel": `<i class="fa-solid fa-adjust"></i> ${this.i18n( `Dark Mode` )}]`,
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

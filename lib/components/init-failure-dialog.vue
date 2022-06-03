<template>
    <ext-dialog :title="i18n(`Server Connection Error`)" width="250" height="300" closable="false" shadow="true">
        <ext-panel layout="center" :html='i18n(`Unable to connect to the API server. Check, that you have internet connection and press "Try Again" button below.`)'/>

        <ext-toolbar docked="bottom" layout='{"type":"hbox","pack":"center"}'>
            <ext-button iconCls="fa-solid fa-redo" :text="i18n(`Try Again`)" ui="action" @tap="close"/>
        </ext-toolbar>
    </ext-dialog>
</template>

<script>
export default {
    "emits": ["close"],

    "methods": {
        close () {
            this.$emit( "close" );

            this.ext.destroy();
        },
    },
};
</script>

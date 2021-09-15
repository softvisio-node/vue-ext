<template>
    <ext-dialog title="Server Connection Error" width="250" height="300" closable="false" draggable="false" closeAction="hide" shadow="true">
        <ext-panel layout="center" html="Unable to connect to the API server."/>

        <ext-toolbar docked="bottom" layout='{"type":"hbox","pack":"center"}'>
            <ext-button iconCls="fas fa-redo" text="Try Again" ui="action" @tap="close"/>
        </ext-toolbar>
    </ext-dialog>
</template>

<script>
export default {
    "emits": ["close"],

    "methods": {
        close () {
            this.ext.hide();

            this.$emit( "close" );
        },
    },
};
</script>

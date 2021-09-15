<template>
    <ext-dialog title="Server Connection Error" width="250" height="300" closable="false" draggable="false" closeAction="hide" shadow="true">
        <ext-panel layout="center" html='Unable to connect to the API server. Check, that you have internet connection and press "Try Again" button below.'/>

        <ext-toolbar docked="bottom" layout='{"type":"hbox","pack":"center"}'>
            <ext-button iconCls="fas fa-redo" text="Try Again" ui="action" @tap="reconnect"/>
        </ext-toolbar>
    </ext-dialog>
</template>

<script>
export default {
    "emits": ["reconnect"],

    "methods": {
        reconnect () {
            this.ext.hide();

            this.$emit( "reconnect" );
        },
    },
};
</script>

<template>
    <ext-dialog title="Server Connection Error" width="250" height="300" displayed="true" closable="false" draggable="false" closeAction="destroy" shadow="true">
        <ext-panel layout="center" html="Unable to connect to the API server."/>

        <ext-toolbar docked="bottom" layout='{"type":"hbox","pack":"center"}'>
            <ext-button iconCls="fas fa-redo" text="Try Again" ui="action" @tap="reconnect"/>
        </ext-toolbar>
    </ext-dialog>
</template>

<script>
export default {
    "methods": {
        reconnect () {
            this.$unmount();
        },
    },
};
</script>

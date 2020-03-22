<template>
    <ext-dialog title="Server Connection Error" width="250" height="300" displayed="true" closable="false" draggable="false" closeAction="destroy" shadow="true" @ready="ready">
        <ext-panel layout="center" html="Unable to connect to the API server."/>

        <ext-toolbar docked="bottom" layout='{"type":"hbox","pack":"center"}'>
            <ext-button iconCls="fas fa-redo" text="Try Again" ui="action" @tap="reconnect"/>
        </ext-toolbar>
    </ext-dialog>
</template>

<script>
import Vue from "vue";

import DialogBase from "./dialog-base";

export default Vue.extend( {
    "extends": DialogBase,

    "methods": {
        reconnect () {
            this.$destroy();
        },
    },
} );
</script>

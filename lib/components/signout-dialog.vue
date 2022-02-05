<template>
    <ext-dialog title="Session Closed" width="250" height="300" closable="false" closeAction="hide" shadow="true">
        <ext-panel layout="center" html='Your session was terminated on the API server. Press "Continue" button below.'/>

        <ext-toolbar docked="bottom" layout='{"type":"hbox","pack":"center"}'>
            <ext-button iconCls="fas fa-redo" text="Continue" ui="action" @tap="close"/>
        </ext-toolbar>
    </ext-dialog>
</template>

<script>
export default {
    "props": {
        "hideOnClose": {
            "type": Boolean,
            "default": false,
        },
    },
    "emits": ["close"],

    "methods": {
        close () {
            this.$emit( "close" );

            if ( this.hideOnClose ) this.ext.destroy();
        },
    },
};
</script>

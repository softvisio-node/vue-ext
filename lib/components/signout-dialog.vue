<template>
    <ext-dialog :title="i18nd(`vue-ext`, `Session closed`)" width="250" height="300" closable="false" closeAction="hide" shadow="true">
        <ext-panel layout="center" :html='i18nd(`vue-ext`, `Your session was terminated on the API server. Press "Continue" button below.`)'/>

        <ext-toolbar docked="bottom" layout='{"type":"hbox","pack":"center"}'>
            <ext-button iconCls="fa-solid fa-redo" :text="i18nd(`vue-ext`, `Continue`)" ui="action" @tap="close"/>
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

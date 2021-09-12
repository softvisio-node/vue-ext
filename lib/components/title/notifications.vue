<template>
    <ext-dialog iconCls="far fa-bell" title="Notifications" width="400" height="90%" draggable="false" closeAction="hide" hideOnMaskTap="true" @ready="ready">
        <!-- - -->
    </ext-dialog>
</template>

<script>
export default {
    "methods": {
        ready ( e ) {
            this.ext = e.detail.cmp;

            this.ext.on( "hide", () => {} );
        },

        close () {
            this.ext.hide();
        },
    },
};
</script>

<template>
    <ext-sheet layout="fit" side="right" modal="true" displayed="false" width="300" @ready="ready">
        <ext-panel iconCls="far fa-bell" title="Notifications" layout="center">
            <ext-container html='<div style="font-size:1.5em;">You have no notifications</div>'/>
        </ext-panel>
    </ext-sheet>
</template>

<script>
export default {
    "methods": {
        ready ( e ) {
            this.ext = e.detail.cmp;
        },

        show () {
            this.ext.show();
        },

        hide () {
            this.ext.hide();
        },
    },
};
</script>

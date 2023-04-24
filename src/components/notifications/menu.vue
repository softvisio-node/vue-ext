<template>
    <ext-sheet layout="fit" modal="true" side="right" width="300" @ready="ready">
        <NotificationsPanel/>
    </ext-sheet>
</template>

<script>
import NotificationsPanel from "#src/components/notifications/panel";
import notificationsStore from "#vue/stores/notifications";

export default {
    "components": { NotificationsPanel },

    "methods": {
        ready ( e ) {
            this.ext = e.detail.cmp;

            this.ext.setEnter( "right" );

            this.ext.setExit( "right" );

            this.ext.setShowAnimation( {
                "type": "slideIn",
                "duration": 250,
                "easing": "ease-out",
            } );

            this.ext.setHideAnimation( {
                "type": "slideOut",
                "duration": 250,
                "easing": "ease-in",
            } );
        },

        show () {
            notificationsStore.refreshRelativeTime();

            this.ext.show();
        },

        hide () {
            this.ext.hide();
        },
    },
};
</script>

<template>
    <ext-dialog closeAction="hide" height="300" layout="fit" padding="0 5 5 5" :title="i18nd(`vue-ext`, `Notifications`)" width="600" @ready="_ready">
        <NotificationsPanel ref="panel"/>
    </ext-dialog>
</template>

<script>
import NotificationsPanel from "#src/components/notifications/panel";
import NotificationsSettingsDialog from "#src/components/notifications/settings.dialog";

export default {
    "components": { NotificationsPanel },

    "methods": {
        _ready ( e ) {
            this.ext = e.detail.cmp;

            this.ext.getHeader().add( [
                {
                    "xtype": "button",
                    "iconCls": "fa-solid fa-cog",
                    "text": this.i18nd( `vue-ext`, `Settings` ),
                    "tooltip": this.i18nd( `vue-ext`, `Notifications settings` ),
                    "handler": this.showNotificationsSettingsDialog.bind( this ),
                },
            ] );

            this.ext.on( "show", () => this.$refs.panel.showInbox() );
        },

        async showNotificationsSettingsDialog () {
            const cmp = await this.$mount( NotificationsSettingsDialog );

            cmp.ext.show();
        },
    },
};
</script>

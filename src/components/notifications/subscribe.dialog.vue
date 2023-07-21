<template>
    <ext-dialog closeAction="hide" height="300" layout="fit" padding="0 5 5 5" :title="i18nd(`vue-ext`, `Notifications`)" width="300" @ready="_ready">
        <NotificationsSubscribePanel ref="panel" :aclId="aclId"/>
    </ext-dialog>
</template>

<script>
import NotificationsSubscribePanel from "#src/components/notifications/subscribe.panel";
import NotificationsSettingsDialog from "#src/components/notifications/settings.dialog";

export default {
    "components": { NotificationsSubscribePanel },

    "props": {
        "aclId": {
            "type": String,
            "default": "",
        },
    },

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

            this.ext.on( "beforeShow", () => this.$refs.panel.refresh() );
        },

        async showNotificationsSettingsDialog () {
            const cmp = await this.$mount( NotificationsSettingsDialog, {
                "props": {
                    "aclId": this.aclId,
                },
            } );

            cmp.ext.show();
        },
    },
};
</script>

<template>
    <CardsPanel ref="cardsPanel" :noDataMessage='`<div style="font-size:1.5em;">` + i18nd(`vue-ext`, `You have no notifications`) + `</div>`' :refreshOnRender="false" :store="store" @refresh="refresh">
        <template #docked>
            <ext-toolbar docked="top">
                <!-- set all as done                         -->
                <ext-button align="right" iconCls="fa-solid fa-check" :tooltip="i18nd(`vue-ext`, `Mark all notifications as done`)" @tap="setDoneAll"/>

                <!-- delete all -->
                <ext-button align="right" iconCls="fa-solid fa-trash-alt" :tooltip="i18nd(`vue-ext`, `Delete all notifications in inbox`)" @tap="deleteAll"/>

                <ext-spacer/>

                <!-- settings button                         -->
                <ext-button align="right" iconCls="fa-solid fa-cog" :tooltip="i18nd(`vue-ext`, `Notifications settings`)" @tap="showNotificationsSettingsDialog"/>

                <!-- refresh button -->
                <ext-button align="right" iconCls="fa-solid fa-redo" :text="i18nd(`vue-ext`, `Refresh`)" @tap="refresh"/>
            </ext-toolbar>
        </template>

        <template #data>
            <ext-componentdataview itemCls="x-listitem" layout="vbox" scrollable="true" @ready="_listReady"/>
        </template>
    </CardsPanel>
</template>

<script>
import NotificationsSettingsDialog from "#src/components/notifications/settings.dialog";
import notificationsStore from "#src/components/notifications/store";
import CardsPanel from "#src/components/cards.panel";

export default {
    "components": { CardsPanel },

    created () {
        this.store = notificationsStore.inboxStore;
    },

    "methods": {
        _listReady ( e ) {
            const ext = e.detail.cmp;

            ext.setPlugins( ["autopaging"] );

            ext.setStore( this.store );

            const tapHandler = this.onNotificationClick.bind( this );

            ext.setItemConfig( {
                "xtype": "container",
                "viewModel": true,
                "layout": "vbox",
                "padding": "5 10 0 10",
                "items": [
                    {
                        "xtype": "component",
                        "bind": `<span class="notification-subject">• {record.subject}</span>`,
                        "listeners": {
                            "tap": function () {
                                tapHandler( this.component.lookupViewModel().get( "record" ) );
                            },
                            "element": "element",
                        },
                    },
                    {
                        "xtype": "component",
                        "bind": `<span class="notification-body">{record.body}</span>`,
                        "listeners": {
                            "tap": function () {
                                tapHandler( this.component.lookupViewModel().get( "record" ) );
                            },
                            "element": "element",
                        },
                    },
                    {
                        "xtype": "container",
                        "layout": { "type": "hbox", "align": "center" },
                        "margin": "5 0 0 0",
                        "items": [
                            {
                                "xtype": "component",
                                "bind": `<i class="fa-solid fa-clock"></i> {record.relative_time}`,
                            },

                            { "xtype": "spacer" },

                            {
                                "xtype": "button",
                                "iconCls": "fa-solid fa-check",
                                "tooltip": this.i18nd( "vue-ext", "Mark as done" ),
                                "handler": this._setDone.bind( this ),
                            },

                            {
                                "xtype": "button",
                                "iconCls": "fa-solid fa-trash-alt",
                                "tooltip": this.i18nd( "vue-ext", "Delete" ),
                                "handler": this._delete.bind( this ),
                            },
                        ],
                    },
                ],
            } );
        },

        async showNotificationsSettingsDialog () {
            const cmp = await this.$mount( NotificationsSettingsDialog );

            cmp.ext.show();
        },

        refresh ( e ) {
            this.$refs.cardsPanel.mask();

            this.store.loadPage( 1 );
        },

        async setDoneAll () {
            await notificationsStore.updateAllNotifications( { "done": true } );
        },

        async deleteAll () {
            await notificationsStore.deleteNotification( { "done": false } );
        },

        async _setDone ( button ) {
            const record = button.lookupViewModel().get( "record" );

            button.disable();

            await notificationsStore.updateNotification( record.id, { "done": true } );

            button.enable();
        },

        async _delete ( button ) {
            const record = button.lookupViewModel().get( "record" );

            button.disable();

            await notificationsStore.deleteNotification( { "id": record.id } );

            button.enable();
        },

        // XXX
        onNotificationClick ( record ) {},
    },
};
</script>

<style>
.notification-subject {
    cursor: pointer;
    font-size: 1.2em;
    font-weight: bold;
}

.notification-body {
    cursor: pointer;
    /* font-weight: bold; */
    /* font-size: 1.2em; */
}
</style>

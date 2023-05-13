<template>
    <CardsPanel ref="cardsPanel" :noDataMessage='`<div style="font-size:1.5em;">` + i18nd(`vue-ext`, `You have no notifications`) + `</div>`' :refreshOnRender="false" :store="store" @refresh="refresh">
        <template #docked>
            <ext-toolbar docked="top">
                <ext-spacer/>
                <ext-button align="right" :hidden="!totalUndoneUnread" iconCls="fa-solid fa-eye" :tooltip="i18nd(`vue-ext`, `Mark all as read`)" @tap="setReadAll"/>
                <!-- <ext-button align="right" iconCls="fa-solid fa-check-double" :tooltip="i18nd( `vue-ext`,`Mark all as done`)" :hidden="!totalUndone" @tap="setDoneAll"/> -->
                <ext-button align="right" :hidden="!totalUndone" iconCls="fa-solid fa-trash-alt" :tooltip="i18nd(`vue-ext`, `Delete all`)" @tap="deleteAll"/>
                <ext-button align="right" iconCls="fa-solid fa-cog" :tooltip="i18nd(`vue-ext`, `Notifications settings`)" @tap="showNotificationsSettingsDialog"/>
                <ext-button align="right" iconCls="fa-solid fa-redo" :tooltip="i18nd(`vue-ext`, `Refresh notifications`)" @tap="refresh"/>
            </ext-toolbar>
        </template>

        <template #data>
            <ext-componentdataview itemCls="x-listitem" layout="vbox" scrollable="true" @ready="_listReady"/>
        </template>
    </CardsPanel>
</template>

<script>
import NotificationsSettingsDialog from "#src/components/notifications/settings.dialog";
import notificationsStore from "#vue/stores/notifications";
import CardsPanel from "#src/components/cards.panel";

export default {
    "components": { CardsPanel },

    "computed": {
        totalUndone () {
            return !!notificationsStore.totalUndone;
        },

        totalUndoneUnread () {
            return !!notificationsStore.totalUndoneUnread;
        },
    },

    created () {
        this.store = notificationsStore.store;

        this.store.reload();
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
                        "bind": `<span class="{record.read ? 'notification-subject-read' : 'notification-subject-unread'}">• {record.subject}</span>`,
                        "listeners": {
                            "tap": function () {
                                tapHandler( this.component.lookupViewModel().get( "record" ) );
                            },
                            "element": "element",
                        },
                    },
                    {
                        "xtype": "component",
                        "bind": `<span class="{record.read ? 'notification-body-read' : 'notification-body-unread'}">{record.body}</span>`,
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
                                "iconCls": "fa-solid fa-eye",
                                "tooltip": this.i18nd( "vue-ext", "Mark as read" ),
                                "bind": { "hidden": "{record.read}" },
                                "handler": this._setRead.bind( this ),
                            },
                            {
                                "xtype": "button",
                                "iconCls": "fa-solid fa-eye-slash",
                                "tooltip": this.i18nd( "vue-ext", "Mark as unread" ),
                                "bind": { "hidden": "{!record.read}" },
                                "handler": this._setUnread.bind( this ),
                            },

                            // {
                            //     "xtype": "button",
                            //     "iconCls": "fa-solid fa-check",
                            //     "tooltip": this.i18nd( "vue-ext", "Mark as done" ),
                            //     "handler": this._setDone.bind( this ),
                            // },
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

            this.store.reload();
        },

        async _setRead ( button ) {
            const record = button.lookupViewModel().get( "record" );

            button.disable();

            await notificationsStore.setRead( record.id );

            button.enable();
        },

        async setReadAll () {
            notificationsStore.setReadAll();
        },

        async _setUnread ( button ) {
            const record = button.lookupViewModel().get( "record" );

            button.disable();

            await notificationsStore.setUnread( record.id );

            button.enable();
        },

        async _setDone ( button ) {
            const record = button.lookupViewModel().get( "record" );

            button.disable();

            await notificationsStore.setDone( record.id );

            button.enable();
        },

        async setDoneAll () {
            notificationsStore.setDoneAll();
        },

        async _delete ( button ) {
            const record = button.lookupViewModel().get( "record" );

            button.disable();

            await notificationsStore.delete( record.id );

            button.enable();
        },

        async deleteAll () {
            notificationsStore.deleteAll();
        },

        // XXX
        onNotificationClick ( record ) {},
    },
};
</script>

<style>
.notification-subject-unread {
    cursor: pointer;
    font-size: 1.2em;
    font-weight: bold;
}

.notification-subject-read {
    cursor: pointer;
    font-size: 1.2em;
    /* font-weight: bold; */
}

.notification-body-unread {
    cursor: pointer;
    font-weight: bold;
    /* font-size: 1.2em; */
}

.notification-body-read {
    cursor: pointer;
    /* font-weight: bold; */
    /* font-size: 1.2em; */
}
</style>

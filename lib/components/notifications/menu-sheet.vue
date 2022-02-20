<template>
    <ext-sheet layout="fit" side="right" modal="true" width="300" @ready="ready">
        <ext-panel ref="card" layout='{"type":"card","animation":"fade"}'>
            <ext-titlebar docked="top" iconCls="fa-solid fa-bell" title="Notifications">
                <ext-button align="right" iconCls="fa-solid fa-eye" tooltip="Mark all as read" :hidden="!totalUndoneUnread" @tap="setReadAll"/>
                <!-- <ext-button align="right" iconCls="fa-solid fa-check-double" tooltip="Mark all as done" :hidden="!totalUndone" @tap="setDoneAll"/> -->
                <ext-button align="right" iconCls="fa-solid fa-trash-alt" tooltip="Delete all" :hidden="!totalUndone" @tap="deleteAll"/>
                <ext-button align="right" iconCls="fa-solid fa-cog" tooltip="Notifications settings" @tap="showNotificationsSettingsDialog"/>
                <ext-button align="right" iconCls="fa-solid fa-redo" tooltip="Refresh notifications" @tap="reload"/>
            </ext-titlebar>
            <ext-panel layout="center">
                <ext-container html='<div style="font-size:1.5em;">You have no notifications</div>'/>
            </ext-panel>
            <ext-panel layout="fit">
                <ext-componentdataview layout="vbox" scrollable="true" itemCls="x-listitem" @ready="listReady"/>
            </ext-panel>
        </ext-panel>
    </ext-sheet>
</template>

<script>
import NotificationsSettingsDialog from "#components/notifications/dialog";

export default {
    "computed": {
        totalUndone () {
            return !!this.$store.notifications.totalUndone;
        },

        totalUndoneUnread () {
            return !!this.$store.notifications.totalUndoneUnread;
        },
    },

    "watch": {
        "totalUndone": "_onTotalUndoneUpdate",
    },

    mounted () {
        this.store = this.$store.notifications.store;

        this.store.reload();
    },

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

            this._onTotalUndoneUpdate();
        },

        listReady ( e ) {
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
                                "tooltip": "Mark as read",
                                "bind": { "hidden": "{record.read}" },
                                "handler": this._setRead.bind( this ),
                            },
                            {
                                "xtype": "button",
                                "iconCls": "fa-solid fa-eye-slash",
                                "tooltip": "Mark as unread",
                                "bind": { "hidden": "{!record.read}" },
                                "handler": this._setUnread.bind( this ),
                            },

                            // {
                            //     "xtype": "button",
                            //     "iconCls": "fa-solid fa-check",
                            //     "tooltip": "Mark as done",
                            //     "handler": this._setDone.bind( this ),
                            // },
                            {
                                "xtype": "button",
                                "iconCls": "fa-solid fa-trash-alt",
                                "tooltip": "Delete",
                                "handler": this._delete.bind( this ),
                            },
                        ],
                    },
                ],
            } );
        },

        async showNotificationsSettingsDialog () {
            const cmp = await this.$mount( NotificationsSettingsDialog );

            this.hide();

            cmp.ext.show();
        },

        show () {
            this.$store.notifications.refreshRelativeTime();

            this.ext.show();
        },

        hide () {
            this.ext.hide();
        },

        async reload ( e ) {
            const button = e.detail.sender;

            button.disable();

            await this.$store.notifications.reload();

            button.enable();
        },

        async _setRead ( button ) {
            const record = button.lookupViewModel().get( "record" );

            button.disable();

            await this.$store.notifications.setRead( record.id );

            button.enable();
        },

        async setReadAll () {
            this.$store.notifications.setReadAll();
        },

        async _setUnread ( button ) {
            const record = button.lookupViewModel().get( "record" );

            button.disable();

            await this.$store.notifications.setUnread( record.id );

            button.enable();
        },

        async _setDone ( button ) {
            const record = button.lookupViewModel().get( "record" );

            button.disable();

            await this.$store.notifications.setDone( record.id );

            button.enable();
        },

        async setDoneAll () {
            this.$store.notifications.setDoneAll();
        },

        async _delete ( button ) {
            const record = button.lookupViewModel().get( "record" );

            button.disable();

            await this.$store.notifications.delete( record.id );

            button.enable();
        },

        async deleteAll () {
            this.$store.notifications.deleteAll();
        },

        _onTotalUndoneUpdate () {
            const value = this.totalUndone;

            if ( !value ) {
                this.$refs.card.ext.setActiveItem( 0 );
            }
            else {
                this.$refs.card.ext.setActiveItem( 1 );
            }
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

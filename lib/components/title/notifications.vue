<template>
    <ext-sheet layout="fit" side="right" modal="true" width="300" @ready="ready">
        <ext-panel ref="card" layout='{"type":"card","animation":"fade"}'>
            <ext-titlebar docked="top" iconCls="far fa-bell" title="Notifications">
                <ext-button align="right" iconCls="fas fa-check-double" tooltip="Mark all as read" :hidden="!hasNotifications" @tap="markAllRead"/>
                <ext-button align="right" iconCls="far fa-trash-alt" tooltip="Delete all notifications" :hidden="!hasNotifications" @tap="deleteAll"/>
                <ext-button align="right" iconCls="fas fa-redo" tooltip="Refresh notifications" @tap="reload"/>
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
export default {
    "props": {
        "markAllReadOnShow": {
            "type": Boolean,
            "default": false,
        },
    },
    "computed": {
        hasNotifications () {
            return !!this.$store.notifications.totalCount;
        },
    },

    "watch": {
        "hasNotifications": "onUpdate",
    },

    mounted () {
        this.store = this.$store.notifications.store;
    },

    "methods": {
        ready ( e ) {
            this.ext = e.detail.cmp;

            this.onUpdate();
        },

        listReady ( e ) {
            const ext = e.detail.cmp;

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
                        "bind": `<span class="notification-subject">{record.subject}</span>`,
                        "style": "cursor:pointer",
                        "listeners": {
                            "tap": function () {
                                tapHandler( this.component.lookupViewModel().get( "record" ) );
                            },
                            "element": "element",
                        },
                    },
                    {
                        "xtype": "component",
                        "style": "cursor:pointer",
                        "bind": "{record.body}",
                        "listeners": {
                            "tap": function () {
                                tapHandler( this.component.lookupViewModel().get( "record" ) );
                            },
                            "element": "element",
                        },
                    },
                    {
                        "xtype": "container",
                        "layout": "hbox",
                        "margin": "5 0 0 0",
                        "items": [
                            {
                                "xtype": "component",
                                "bind": `<i class="far fa-clock"></i> {record.relative_time}`,
                            },
                            { "xtype": "spacer" },
                            {
                                "xtype": "button",
                                "iconCls": "far fa-eye",
                                "tooltip": "Mark as read",
                                "bind": { "hidden": "{record.read}" },
                                "handler": this.readNotification.bind( this ),
                            },
                            {
                                "xtype": "button",
                                "iconCls": "far fa-eye-slash",
                                "tooltip": "Mark as unread",
                                "bind": { "hidden": "{!record.read}" },
                                "handler": this.unreadNotification.bind( this ),
                            },
                            {
                                "xtype": "button",
                                "iconCls": "fas fa-check",
                                "tooltip": "Mark as read",
                                "handler": this.readNotification.bind( this ),
                            },
                            {
                                "xtype": "button",
                                "iconCls": "far fa-trash-alt",
                                "tooltip": "Delete",
                                "handler": this.deleteNotification.bind( this ),
                            },
                        ],
                    },
                ],
            } );
        },

        show () {
            this.$store.notifications.refreshRelativeTime();

            if ( this.markAllReadOnShow ) this.$store.notifications.markAllRead();

            this.ext.show( { "type": "slideIn" } );
        },

        hide () {
            this.ext.hide( { "type": "slideOut" } );
        },

        async markAllRead () {
            this.$store.notifications.markAllRead();
        },

        async readNotification ( button ) {
            const record = button.lookupViewModel().get( "record" );

            button.disable();

            await this.$store.notifications.markRead( record.id );

            button.enable();
        },

        async unreadNotification ( button ) {
            const record = button.lookupViewModel().get( "record" );

            button.disable();

            await this.$store.notifications.markUnread( record.id );

            button.enable();
        },

        async deleteNotification ( button ) {
            const record = button.lookupViewModel().get( "record" );

            button.disable();

            await this.$store.notifications.delete( record.id );

            button.enable();
        },

        async deleteAll ( e ) {
            if ( !( await this.$utils.confirm( "Confirmation", "Are you sure you want to delete all notifications?" ) ) ) return;

            const button = e.detail.sender;

            button.disable();

            await this.$store.notifications.deleteAll();

            button.enable();
        },

        async reload ( e ) {
            const button = e.detail.sender;

            button.disable();

            await this.$store.notifications.reload();

            button.enable();
        },

        onUpdate () {
            const value = this.hasNotifications;

            if ( !value ) {
                this.$refs.card.ext.setActiveItem( 0 );
            }
            else {
                this.$refs.card.ext.setActiveItem( 1 );
            }
        },

        onNotificationClick ( record ) {},
    },
};
</script>

<style>
.notification-subject {
    font-weight: bold;
    font-size: 1.2em;
}
</style>

<template>
    <ext-sheet layout="fit" side="right" modal="true" width="300" @ready="ready">
        <ext-panel ref="card" layout='{"type":"card","animation":"fade"}'>
            <ext-titlebar docked="top" iconCls="far fa-bell" title="Notifications">
                <ext-button ref="deleteAllButton" align="right" iconCls="far fa-trash-alt" tooltip="Delete all notifications" @tap="deleteAll"/>
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
    "computed": {
        totalNotifications () {
            return this.$store.notifications.totalCount;
        },
    },

    "watch": {
        "totalNotifications": "onUpdate",
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

            ext.setItemConfig( {
                "xtype": "container",
                "viewModel": true,
                "layout": "vbox",
                "padding": "5 10 0 10",
                "items": [
                    {
                        "xtype": "component",
                        "bind": `<span class="notification-subject">{record.subject}</span>`,
                    },
                    {
                        "xtype": "component",
                        "bind": "{record.body}",
                    },
                    {
                        "xtype": "container",
                        "layout": { "type": "hbox", "pack": "end", "align": "center" },
                        "items": [
                            {
                                "xtype": "component",
                                "bind": `<i class="far fa-clock"></i> {record.relative_time}`,
                            },
                            {
                                "xtype": "button",
                                "iconCls": "fas fa-ellipsis-v",
                                "arrow": false,
                                "menu": [
                                    {
                                        "xtype": "button",
                                        "iconCls": "far fa-trash-alt",
                                        "text": "Delete",
                                        "handler": this.deleteNotification.bind( this ),
                                    },
                                ],
                            },
                        ],
                    },
                ],
            } );
        },

        show () {
            this.$store.notifications.refreshRelativeTime();

            this.$store.notifications.markAllRead();

            this.ext.show();
        },

        hide () {
            this.ext.hide();
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
            const value = this.totalNotifications;

            if ( !value ) {
                this.$refs.card.ext.setActiveItem( 0 );

                this.$refs.deleteAllButton.ext.hide();
            }
            else {
                this.$refs.card.ext.setActiveItem( 1 );

                this.$refs.deleteAllButton.ext.show();
            }
        },
    },
};
</script>

<style>
.notification-subject {
    font-weight: bold;
    font-size: 1.2em;
}
</style>

<template>
    <ext-sheet layout="fit" side="right" modal="true" width="300" @ready="ready">
        <ext-panel ref="card" iconCls="far fa-bell" title="Notifications" layout="card">
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
    mounted () {
        this.store = this.$store.notifications.store;

        this.store.on( "datachanged", this._onNotificationsLoad, this );
    },

    "methods": {
        ready ( e ) {
            this.ext = e.detail.cmp;

            this._onNotificationsLoad();
        },

        listReady ( e ) {
            const ext = e.detail.cmp;

            ext.setStore( this.store );

            ext.setItemConfig( {
                "xtype": "container",
                "viewModel": true,
                "layout": "vbox",
                "padding": "5 10 5 10",
                "items": [
                    {
                        "xtype": "container",
                        "layout": "hbox",
                        "items": [
                            {
                                "xtype": "component",
                                "flex": 1,
                                "bind": `<span class="notification-subject">{record.subject}</span>`,
                            },
                            {
                                "xtype": "button",
                                "iconCls": "fas fa-ellipsis-v",
                            },
                        ],
                    },
                    {
                        "xtype": "component",
                        "bind": "{record.body}",
                    },
                    {
                        "xtype": "container",
                        "layout": "hbox",
                        "padding": "5 0 0 0",
                        "items": [
                            { "xtype": "spacer" },
                            {
                                "xtype": "component",
                                "bind": `<i class="far fa-clock"></i> {record.relative_time}`,
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

        // protected
        _onNotificationsLoad () {
            const count = this.store.count();

            if ( !count ) {
                this.$refs.card.ext.setActiveItem( 0 );
            }
            else {
                this.$refs.card.ext.setActiveItem( 1 );
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

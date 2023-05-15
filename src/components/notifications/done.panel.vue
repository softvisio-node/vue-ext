<template>
    <CardsPanel ref="cardsPanel" :refreshOnRender="false" :store="store" @refresh="refresh">
        <template #docked>
            <ext-toolbar docked="top">
                <!-- set all as done                         -->
                <ext-button align="right" :disabled="!hasNotifications" iconCls="fa-solid fa-arrow-right" :text="i18nd(`vue-ext`, `Move all to inbox`)" @tap="moveAllToInbox"/>

                <!-- delete all -->
                <ext-button align="right" :disabled="!hasNotifications" iconCls="fa-solid fa-trash-alt" :text="i18nd(`vue-ext`, `Delete all`)" @tap="deleteAll"/>
            </ext-toolbar>
        </template>

        <template #data>
            <ext-grid hideHeaders="true" itemConfig='{"viewModel":true}' layout="fit" plugins='["autopaging"]' variableHeights="true" @ready="_gridReady">
                <ext-column flex="1" @ready="_colReady"/>
            </ext-grid>
        </template>
    </CardsPanel>
</template>

<script>
import notificationsStore from "#src/components/notifications/store";
import CardsPanel from "#src/components/cards.panel";

export default {
    "components": { CardsPanel },

    "computed": {
        hasNotifications () {
            return !!notificationsStore.totalDone;
        },
    },

    created () {
        this.store = notificationsStore.doneStore;
    },

    "methods": {
        _gridReady ( e ) {
            const cmp = e.detail.cmp;

            cmp.setStore( this.store );
        },

        _colReady ( e ) {
            const cmp = e.detail.cmp;

            cmp.setCell( {
                "xtype": "widgetcell",
                "widget": {
                    "xtype": "container",
                    "layout": "vbox",
                    "padding": "5 10 0 10",
                    "items": [

                        // subject
                        {
                            "xtype": "container",
                            "cls": "notification-subject",
                            "bind": `• {record.subject}`,
                        },

                        // body
                        {
                            "xtype": "container",
                            "cls": "notification-body",
                            "bind": `{record.body}`,
                        },

                        // status
                        {
                            "xtype": "container",
                            "layout": { "type": "hbox", "align": "center" },
                            "margin": "5 0 0 0",
                            "items": [
                                {
                                    "xtype": "container",
                                    "bind": `<i class="fa-solid fa-clock"></i> {record.relative_time}`,
                                },

                                { "xtype": "spacer" },

                                {
                                    "xtype": "button",
                                    "iconCls": "fa-solid fa-arrow-right",
                                    "tooltip": this.i18nd( "vue-ext", "Move to inbox" ),
                                    "handler": this._moveToInbox.bind( this ),
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
                },
            } );
        },

        refresh ( e ) {
            this.$refs.cardsPanel.mask();

            this.store.loadPage( 1 );
        },

        async moveAllToInbox () {
            await notificationsStore.updateAllNotifications( { "done": false } );
        },

        async deleteAll () {
            await notificationsStore.deleteNotification( { "done": true } );
        },

        async _moveToInbox ( button ) {
            const record = button.lookupViewModel().get( "record" );

            button.disable();

            await notificationsStore.updateNotification( record.id, { "done": false } );

            button.enable();
        },

        async _delete ( button ) {
            const record = button.lookupViewModel().get( "record" );

            button.disable();

            await notificationsStore.deleteNotification( { "id": record.id } );

            button.enable();
        },
    },
};
</script>

<style>
.notification-subject {
    white-space: normal;
    cursor: pointer;
    font-size: 1.2em;
    font-weight: bold;
}

.notification-body {
    white-space: normal;
    cursor: pointer;
    /* font-weight: bold; */
    /* font-size: 1.2em; */
}
</style>

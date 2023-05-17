<template>
    <CardsPanel ref="cardsPanel" :refreshOnRender="false" :store="store" @refresh="refresh">
        <template #docked>
            <ext-toolbar docked="top">
                <!-- set all as done                         -->
                <ext-button align="right" :disabled="!hasNotifications" iconCls="fa-solid fa-check" :text="i18nd(`vue-ext`, `Mark all as done`)" @tap="setDoneAll"/>

                <!-- delete all -->
                <ext-button align="right" :disabled="!hasNotifications" iconCls="fa-solid fa-trash-alt" :text="i18nd(`vue-ext`, `Delete all`)" @tap="deleteAll"/>
            </ext-toolbar>
        </template>

        <template #data>
            <ext-grid hideHeaders="true" itemConfig='{"viewModel":true}' layout="fit" plugins='["autopaging"]' variableHeights="true" @ready="_gridReady">
                <!-- XXX margin is required to prevent horizontal scrolling -->
                <ext-column flex="1" margin="0 7 0 0" @ready="_colReady"/>
            </ext-grid>
        </template>
    </CardsPanel>
</template>

<script>
import notificationsStore from "#src/components/notifications/store";
import CardsPanel from "#src/components/cards.panel";
import "./assets/style.css";

export default {
    "components": { CardsPanel },

    "computed": {
        hasNotifications () {
            return !!notificationsStore.totalInbox;
        },
    },

    created () {
        this.store = notificationsStore.inboxStore;
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
                    "padding": "0 5 20 10",
                    "items": [

                        // subject
                        {
                            "xtype": "container",
                            "layout": { "type": "hbox", "align": "center" },
                            "items": [
                                {
                                    "xtype": "container",
                                    "cls": "notification-subject",
                                    "bind": `{record.subject}`,
                                },

                                { "xtype": "spacer" },

                                {
                                    "xtype": "container",
                                    "bind": `<i class="fa-regular fa-clock"></i> {record.relative_time}`,
                                },
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

                        // body
                        {
                            "xtype": "container",
                            "cls": "notification-body",
                            "padding": "0 0 0 5",
                            "bind": `{record.body}`,
                        },
                    ],
                },
            } );
        },

        refresh ( e ) {
            this.$refs.cardsPanel.mask();

            this.store.loadPage( 1 );
        },

        async setDoneAll () {
            await notificationsStore.updateNotifications( { "done": true } );
        },

        async deleteAll () {
            await notificationsStore.deleteNotification( { "done": false } );
        },

        async _setDone ( button ) {
            const record = button.lookupViewModel().get( "record" );

            button.disable();

            await notificationsStore.updateNotifications( { "id": record.id, "done": true } );

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

<template>
    <ext-panel layout="vbox" @ready="_ready">
        <ext-container html=""/>

        <ext-grid flex="1" itemConfig='{"viewModel":true}' @ready="_gridReady">
            <ext-column text="Notification Type" dataIndex="title" flex="1" cell='{"encodeHtml":false}'/>
            <ext-column text="Internal<br/>notifications" width="100" align="center" @ready="_internalColReady"/>
            <ext-column text="Email<br/>notifications" width="100" @ready="_emailColReady"/>
            <ext-column text="Telegram<br/>notifications" width="100" @ready="_telegramColReady"/>
            <ext-column text="Push<br/>notifications" width="100" @ready="_pushColReady"/>
        </ext-grid>
    </ext-panel>
</template>

<script>
export default {
    "methods": {
        _ready ( e ) {
            this.reload();
        },

        _gridReady ( e ) {
            const cmp = e.detail.cmp;

            cmp.setStore( this.$store.notifications.settingsStore );
        },

        _internalColReady ( e ) {
            this._toggleColReady( "internal", e );
        },

        _emailColReady ( e ) {
            this._toggleColReady( "email", e );
        },

        _telegramColReady ( e ) {
            this._toggleColReady( "telegram", e );
        },

        _pushColReady ( e ) {
            this._toggleColReady( "push", e );
        },

        _toggleColReady ( channel, e ) {
            const cmp = e.detail.cmp;

            cmp.setCell( {
                "xtype": "widgetcell",
                "widget": {
                    "xtype": "container",
                    "layout": { "type": "hbox", "pack": "center" },
                    "items": [
                        {
                            "xtype": "togglefield",
                            "bind": {
                                "value": `{record.${channel}}`,
                                "disabled": `{!record.${channel}_enabled}`,
                            },
                            "listeners": { "change": this.toggleChannelEnabled.bind( this, channel ) },
                        },
                    ],
                },
            } );
        },

        // XXX
        async reload () {
            await this.$store.notifications.reloadSettings();
        },

        async toggleChannelEnabled ( channel, button, newVal, oldVal ) {
            const record = button.up( "gridrow" ).getRecord(),
                curVal = record.get( channel );

            if ( newVal === curVal ) return;

            button.disable();

            var res = await this.$api.call( "notifications/set-user-notification-channel", record.get( "type" ), channel, newVal );

            if ( !res.ok ) {
                this.$utils.toast( res );

                await this.$utils.sleep( 1000 );

                button.suspendEvent( "change" );
                record.set( "enabled", oldVal );
                button.enable();
                button.resumeEvent( "change" );
            }
            else {
                button.enable();
            }

            return;
        },
    },
};
</script>

<style>
.notification-type-name {
    font-weight: bold;
    font-size: 1.2em;
}

.notification-type-description {
    font-size: 1em;
}
</style>

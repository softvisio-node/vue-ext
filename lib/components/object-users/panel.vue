<template>
    <ext-grid flex="1" itemConfig='{"viewModel":true}' sortable="false" columnMenu="false" columnResize="false" @ready="_gridReady">
        <ext-toolbar docked="top">
            <ext-container html="Notification Types"/>
        </ext-toolbar>
        <ext-column dataIndex="title" flex="1" cell='{"encodeHtml":false}'/>
        <ext-column text='<div style="text-align:center"><b>Internal</b><br/>notifications</div>' width="100" align="center" @ready="_internalColReady"/>
        <ext-column text='<div style="text-align:center"><b>Email</b><br/>notifications</div>' width="100" align="center" @ready="_emailColReady"/>
        <ext-column text='<div style="text-align:center"><b>Telegram</b><br/>notifications</div>' width="100" align="center" @ready="_telegramColReady"/>
        <ext-column text='<div style="text-align:center"><b>Push</b><br/>notifications</div>' width="100" align="center" @ready="_pushColReady"/>
    </ext-grid>
</template>

<script>
import ObjectUserModel from "#models/object-user";
import ObjectRoleModel from "#models/object-role";

export default {
    created () {
        this.usersStore = Ext.create( "Ext.data.Store", {
            "model": ObjectUserModel,
        } );

        this.rolesStore = Ext.create( "Ext.data.Store", {
            "model": ObjectRoleModel,
        } );
    },

    "methods": {
        setObjectId ( objectId ) {
            this.objectId = objectId;

            this.reload();
        },

        _ready ( e ) {},

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
            const res = await this.$api.call( "object-users/get-object-users", this.objectId );

            console.log( res );
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
                record.set( channel, oldVal );
                button.enable();
                button.resumeEvent( "change" );
            }
            else {
                button.enable();
            }

            return;
        },

        _openTelegramBot () {
            window.open( this.telegramBotUrl, "_blank" ).focus();
        },

        async _updateTelegramUsername ( e ) {
            const button = e.detail.sender,
                field = this.$refs.telegramUsernameField.ext,
                value = field.getValue();

            button.disable();

            const res = await this.$api.call( "profile/set-telegram-username", value );

            button.enable();

            if ( !res.ok ) {
                this.$utils.toast( res );
            }
            else {
                this.$store.notifications.telegramUsername = value;

                this.$utils.toast( `Telegram username updated` );
            }
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

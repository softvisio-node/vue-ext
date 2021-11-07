<template>
    <ext-grid flex="1" itemConfig='{"viewModel":true}' sortable="false" columnMenu="false" columnResize="false" @ready="_ready">
        <ext-toolbar docked="top">
            <!-- <ext-container html="Notification Types"/> -->
        </ext-toolbar>
        <ext-column text="Username" dataIndex="username" flex="1" cell='{"encodeHtml":false}'/>
        <ext-column text="Role" dataIndex="role_name" flex="1" cell='{"encodeHtml":false}'/>
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

        _ready ( e ) {
            const cmp = e.detail.cmp;

            cmp.setStore( this.usersStore );
        },

        async reload () {
            const res = await this.$api.call( "object-users/get-object-users", this.objectId );

            if ( !res.ok ) {
                this.$utils.tolast( res );

                this.rolesStore.loadRawData( [] );
                this.usersStore.loadRawData( [] );
            }
            else {
                this.rolesStore.loadRawData( res.data.roles );
                this.usersStore.loadRawData( res.data.users );
            }
        },

        // XXX
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

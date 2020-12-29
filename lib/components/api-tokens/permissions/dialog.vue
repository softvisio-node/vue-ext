<template>
    <ext-dialog title="Edit Token Permissions" width="800" height="90%" displayed="true" closable="true" draggable="false" closeAction="hide" hideOnMaskTap="true" layout="fit" viewModel="true">
        <ext-grid plugins='{"gridsummaryrow":"true"}' multicolumnSort="true" @ready="gridReady">
            <ext-column text="Name" dataIndex="name" width="150"/>

            <ext-column text="Description" dataIndex="description" flex="1"/>

            <ext-column text="Enabled" width="95" sorter='{"property":"enabled"}' summaryDataIndex="-" @ready="enabledColReady"/>
        </ext-grid>

        <ext-toolbar docked="bottom" layout='{"type":"hbox","pack":"end"}'>
            <ext-button text="Cancel" ui="decline" @tap="close"/>
            <ext-button text="Submit" ui="action" bind='{"disabled":"{!dirty}"}' @tap="submit"/>
        </ext-toolbar>
    </ext-dialog>
</template>

<script>
import UserPermissionsModel from "../../../models/permissions";

export default {
    mounted () {
        this.store = new Ext.data.Store( {
            "model": UserPermissionsModel,
            "autoLoad": false,
            "remoteSort": false,
            "remoteFilter": false,
        } );

        this.store.on( "datachanged", store => this.ext.getViewModel().set( "dirty", !!store.getUpdatedRecords().length ) );
    },

    "methods": {
        gridReady ( e ) {
            var grid = e.detail.cmp;

            grid.setMultiColumnSort( true );

            // grid.setColumnMenu( null );

            grid.setItemConfig( { "viewModel": true } );

            grid.setStore( this.store );
        },

        enabledColReady ( e ) {
            var cmp = e.detail.cmp;

            cmp.setCell( {
                "xtype": "widgetcell",
                "widget": {
                    "xtype": "container",
                    "layout": { "type": "hbox", "pack": "center" },
                    "items": [
                        {
                            "xtype": "togglefield",
                            "bind": { "value": "{record.enabled}" },
                        },
                    ],
                },
            } );
        },

        async setRecord ( record ) {
            this.record = record;

            this.ext.mask();

            const res = await this.$api.call( "api-tokens/get-permissions", record.id );

            this.ext.unmask();

            if ( !res.ok ) {
                this.$.toast( res );

                this.close();
            }
            else {
                this.store.setData( [] );
                this.store.setData( res.data );
            }
        },

        close () {
            this.ext.hide();
        },

        async submit () {
            const permissions = {};

            this.store.each( record => {
                if ( !record.dirty ) return;

                permissions[record.id] = record.get( "enabled" );
            } );

            const res = await this.$api.call( "api-tokens/update-permissions", this.record.id, permissions );

            if ( !res.ok ) {
                this.$.toast( res );
            }
            else {
                this.$.toast( "Token permissions updated" );

                this.record.set( "permissions", Ext.apply( {}, permissions, this.record.get( "permissions" ) ) );

                this.close();
            }
        },
    },
};
</script>

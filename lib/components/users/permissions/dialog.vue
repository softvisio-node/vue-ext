<template>
    <ext-dialog title="Edit User Permissions" width="800" height="400" displayed="true" closable="true" draggable="false" closeAction="hide" hideOnMaskTap="true" layout="fit" viewModel="true">
        <ext-grid plugins='{"gridsummaryrow":"true"}' multicolumnSort="true" @ready="gridReady">
            <ext-column text="Name" dataIndex="name" width="150"/>

            <ext-column text="Description" dataIndex="description" flex="1"/>

            <ext-column text="Enabled" width="95" sorter='{"property":"enabled"}' summaryDataIndex="-" @ready="enabledColReady"/>
        </ext-grid>

        <ext-toolbar docked="bottom" layout='{"type":"hbox","pack":"end"}'>
            <ext-button text="Cancel" ui="decline" @tap="cancel"/>
            <ext-button text="Submit" ui="action" bind='{"disabled":"{!dirty}"}' @tap="submit"/>
        </ext-toolbar>
    </ext-dialog>
</template>

<script>
import UserPermissionsModel from "../../../models/user/permissions";

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
                            "bind": { "value": "{record.enabled}", "disabled": "{record.readonly}" },
                        },
                    ],
                },
            } );
        },

        async setRecord ( record ) {
            this.record = record;

            this.ext.mask();

            const res = await this.$api.call( "admin/users/get-permissions", this.record.id );

            this.ext.unmask();

            if ( !res.ok ) {
                this.$.toast( res );

                this.cancel();
            }
            else {
                this.store.setData( res.data );
            }
        },

        cancel () {
            this.ext.hide();
        },

        async submit () {
            var form = this.$refs.form.ext;

            if ( !form.validate() ) return;

            var vals = form.getValues();

            if ( vals.password !== vals.password1 ) {
                form.getFields( "password1" ).setError( "Passwords are not match" );

                return;
            }

            if ( vals.admin ) {
                vals.permissions = {
                    "admin": true,
                };
            }

            delete vals.admin;
            delete vals.password1;

            var res = await this.$api.call( "admin/users/create", vals );

            if ( res.ok ) {
                this.$.toast( "User created" );

                this.$store.users.reload();

                this.cancel();
            }
            else {
                this.$.toast( res );
            }
        },
    },
};
</script>

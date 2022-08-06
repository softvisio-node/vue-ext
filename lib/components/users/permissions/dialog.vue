<template>
    <ext-dialog closeAction="hide" height="90%" layout="fit" :title="i18nd(`vue-ext`, `Edit user permissions`)" viewModel="true" width="800">
        <ext-grid multicolumnSort="true" plugins='{"gridsummaryrow":true}' @ready="gridReady">
            <ext-column dataIndex="name" :text="i18nd(`vue-ext`, `Role`)" width="150"/>

            <ext-column dataIndex="description" flex="1" :text="i18nd(`vue-ext`, `Description`)"/>

            <ext-column sorter='{"property":"enabled"}' summaryDataIndex="-" :text="i18nd(`vue-ext`, `Enabled`)" width="95" @ready="enabledColReady"/>
        </ext-grid>

        <ext-toolbar docked="bottom" layout='{"pack":"end","type":"hbox"}'>
            <ext-button bind='{"disabled":"{!dirty}"}' :text="i18nd(`vue-ext`, `Save`)" ui="action" @tap="submit"/>
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

            const res = await this.$api.call( "admin/user/get-permissions", record.id );

            this.ext.unmask();

            if ( !res.ok ) {
                this.$utils.toast( res );

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

            const res = await this.$api.call( "admin/user/update-permissions", this.record.id, permissions );

            if ( !res.ok ) {
                this.$utils.toast( res );
            }
            else {
                this.$utils.toast( this.i18nd( `vue-ext`, "User permissions updated" ) );

                this.record.set( "permissions", Ext.apply( {}, permissions, this.record.get( "permissions" ) ) );

                this.close();
            }
        },
    },
};
</script>

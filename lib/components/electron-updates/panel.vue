<template>
    <ext-grid ref="grid" layout="fit" plugins='{"gridsummaryrow":"true"}' multicolumnSort="true" @ready="gridReady">
        <ext-toolbar docked="top">
            <ext-spacer/>
            <ext-button iconCls="fas fa-upload" text="Upload Release" @tap="create"/>
        </ext-toolbar>

        <ext-column text="Plaform" dataIndex="platform_name" sorter='{"property":"platform"}' flex="1" cell='{"encodeHtml":false}'/>
        <ext-column text="Arch" dataIndex="arch" flex="1"/>
        <ext-column text="Version" dataIndex="version" sorter='{"property":"version_sort"}' flex="1"/>
        <ext-column text="Created" dataIndex="created" width="150" formatter="date('Y-m-d H:i')"/>
        <ext-column text="Published" width="110" sorter='{"property":"published"}' summaryDataIndex="-" @ready="publishedColReady"/>

        <ext-column width="40" @ready="actionColReady"/>
    </ext-grid>
</template>

<script>
import CreateDialog from "./create/dialog";

export default {
    data () {
        return {
            "store": this.$store.state.electronUpdatesStore,
        };
    },

    "methods": {
        gridReady ( e ) {
            var grid = e.detail.cmp;

            grid.setMultiColumnSort( true );

            grid.setPlugins( [

                //
                { "type": "gridviewoptions" },
                { "type": "listpaging", "noMoreRecordsText": "", "autoPaging": false },
            ] );

            // grid.setColumnMenu( null );

            grid.setItemConfig( { "viewModel": true } );

            grid.setStore( this.store );

            this.store.load();
        },

        publishedColReady ( e ) {
            var cmp = e.detail.cmp;

            cmp.setCell( {
                "xtype": "widgetcell",
                "widget": {
                    "xtype": "container",
                    "layout": { "type": "hbox", "pack": "center" },
                    "items": [
                        {
                            "xtype": "togglefield",
                            "bind": { "value": "{record.published}" },
                            "listeners": { "change": this.setPublished.bind( this ) },
                        },
                    ],
                },
            } );
        },

        actionColReady ( e ) {
            var cmp = e.detail.cmp;

            cmp.setCell( {
                "xtype": "widgetcell",
                "widget": {
                    "xtype": "container",
                    "layout": { "type": "hbox", "pack": "end", "align": "end" },
                    "items": [
                        {
                            "xtype": "button",
                            "iconCls": "far fa-trash-alt",
                            "handler": this.delete.bind( this ),
                        },
                    ],
                },
            } );
        },

        async setPublished ( button, newVal, oldVal ) {
            const gridrow = button.up( "gridrow" ),
                record = gridrow.getRecord(),
                curVal = record.get( "published" );

            if ( newVal === curVal ) return;

            button.disable();

            var res = await this.$api.call( "electron-updates/set-published", record.get( "id" ), newVal );

            if ( !res.ok ) {
                this.$.toast( res );

                await this.$.sleep( 1000 );

                button.suspendEvent( "change" );
                record.set( "published", oldVal );
                button.enable();
                button.resumeEvent( "change" );
            }
            else {
                button.enable();
            }

            return;
        },

        async delete ( button ) {
            const gridrow = button.up( "gridrow" ),
                record = gridrow.getRecord();

            if ( !( await this.$.confirm( "Confirmation", "Are you sure you want to do that?" ) ) ) return;

            var res = await this.$api.call( "electron-updates/delete", record.getId() );

            if ( res.ok ) {
                this.$.toast( "Update deleted" );

                this.store.remove( record );
            }
            else {
                this.$.toast( res );
            }
        },

        async create () {
            if ( !this.createDialog ) this.createDialog = await Ext.Viewport.addVue( CreateDialog );

            this.createDialog.ext.show();
        },
    },
};
</script>

<template>
    <ext-grid ref="grid" layout="fit" plugins='{"gridsummaryrow":true}' multicolumnSort="true" @ready="gridReady">
        <ext-toolbar docked="top">
            <ext-spacer/>
            <ext-button iconCls="fa-solid fa-upload" text="Upload Release" @tap="create"/>
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
    mounted () {
        this.store = this.$store["electron-updates"].store;
    },

    "methods": {
        gridReady ( e ) {
            var grid = e.detail.cmp;

            grid.setPlugins( ["gridviewoptions", "autopaging"] );

            // grid.setColumnMenu( null );

            grid.setItemConfig( { "viewModel": true } );

            grid.setStore( this.store );

            this.reload();
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
                            "iconCls": "fa-solid fa-trash-alt",
                            "handler": this.delete.bind( this ),
                        },
                    ],
                },
            } );
        },

        reload () {
            this.$store["electron-updates"].reload();
        },

        async setPublished ( button, newVal, oldVal ) {
            const gridrow = button.up( "gridrow" ),
                record = gridrow.getRecord(),
                curVal = record.get( "published" );

            if ( newVal === curVal ) return;

            button.disable();

            var res = await this.$api.call( "electron-updates/set-published", record.get( "id" ), newVal );

            if ( !res.ok ) {
                this.$utils.toast( res );

                await this.$utils.sleep( 1000 );

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

            if ( !( await this.$utils.confirm( "Confirmation", "Are you sure you want to delete release?" ) ) ) return;

            var res = await this.$api.call( "electron-updates/delete", record.getId() );

            if ( res.ok ) {
                this.$utils.toast( this.i18n( "Update deleted" ) );

                this.store.remove( record );
            }
            else {
                this.$utils.toast( res );
            }
        },

        async create () {
            const cmp = await this.$mount( CreateDialog );

            cmp.ext.show();
        },
    },
};
</script>

<template>
    <ext-grid ref="grid" layout="fit" plugins='{"gridsummaryrow":"true"}' multicolumnSort="true" @ready="gridReady">
        <ext-column width="40" @ready="avatarColReady"/>

        <ext-column text="Name" dataIndex="name" flex="1" summaryDataIndex="total" @ready="nameColReady"/>

        <ext-column text="Created" dataIndex="created" width="150" formatter="date('Y-m-d H:i')"/>

        <ext-column text="Enabled" width="95" sorter='{"property":"enabled"}' summaryDataIndex="-" @ready="enabledColReady"/>

        <ext-column width="40" @ready="actionColReady"/>
    </ext-grid>
</template>

<script>
import "#ewc/ext-grid.component";
import "#ewc/ext-image.component";
import "#ewc/ext-column.component";

export default {
    data () {
        return {
            "store": this.$store.state.userStore,
        };
    },

    "methods": {
        gridReady ( e ) {
            var grid = e.detail.cmp;

            grid.setStore( this.store );

            this.store.load();

            grid.setColumnMenu( null );

            grid.setItemConfig( { "viewModel": true } );
        },

        avatarColReady ( e ) {
            var cmp = e.detail.cmp;

            cmp.setCell( {
                "xtype": "widgetcell",
                "widget": {
                    "xtype": "img",
                    "height": 36,
                    "bind": { "src": "{record.avatar}" },
                },
            } );
        },

        nameColReady ( e ) {
            var cmp = e.detail.cmp;

            cmp.setCell( { "encodeHtml": false } );

            cmp.setSummaryRenderer( function ( val, context ) {
                return "Total Users: " + val;
            } );
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
                            "listeners": { "change": this.setUserEnabled.bind( this ) },
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
                            "iconCls": "fas fa-trash-alt",
                            "handler": this.delete.bind( this ),
                        },
                    ],
                },
            } );
        },

        async setUserEnabled ( button, newVal, oldVal ) {
            const gridrow = button.up( "gridrow" ),
                record = gridrow.getRecord(),
                curVal = record.get( "enabled" );

            if ( newVal === curVal ) return;

            button.disable();

            var res = await this.$api.call( "admin/users/set-enabled", record.get( "id" ), newVal );

            if ( !res.isSuccess() ) {
                this.$toast( res );

                setTimeout( function () {
                    button.suspendEvent( "change" );
                    record.set( "enabled", oldVal );
                    button.enable();
                    button.resumeEvent( "change" );
                }, 1000 );
            }
            else {
                button.enable();
            }

            return;
        },

        async delete ( button ) {
            const gridrow = button.up( "gridrow" ),
                record = gridrow.getRecord();

            var confirm = async function () {
                return new Promise( ( resolve ) => {
                    Ext.Msg.confirm( "Confirmation", "Are you sure you want to do that?", function ( buttonId ) {
                        resolve( buttonId === "yes" ? true : false );
                    } );
                } );
            };

            if ( !( await confirm() ) ) return;

            var res = await this.$api.call( "admin/users/delete", record.getId() );

            if ( res.isSuccess() ) {
                this.$toast( "User deleted" );

                this.store.remove( record );
            }
            else {
                this.$toast( res );
            }
        },
    },
};
</script>
<!-- -----SOURCE FILTER LOG BEGIN----- -->
<!-- -->
<!-- +-------+---------------+------------------------------+--------------------------------------------------------------------------------+ -->
<!-- | Sev.  | Line:Col      | Rule                         | Description                                                                    | -->
<!-- |=======+===============+==============================+================================================================================| -->
<!-- |  WARN | 58:53         | no-unused-vars               | 'context' is defined but never used.                                           | -->
<!-- +-------+---------------+------------------------------+--------------------------------------------------------------------------------+ -->
<!-- -->
<!-- -----SOURCE FILTER LOG END----- -->

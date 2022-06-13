<template>
    <ext-dialog :title="title" width="95%" height="95%" scrollable="true" closeAction="hide" layout="fit" viewModel="true">
        <ext-toolbar docked="top">
            <ext-spacer/>
            <ext-button iconCls="fa-solid fa-redo" :text="i18nd(`vue-ext`, `Refresh`)" @tap="refresh"/>
        </ext-toolbar>

        <ext-grid ref="grid" layout="fit" multicolumnSort="true" @ready="gridReady">
            <ext-column :text="i18nd(`vue-ext`, `Started`)" dataIndex="started" width="150" formatter="date('Y-m-d H:i:s')"/>
            <ext-column :text="i18nd(`vue-ext`, `Finished`)" dataIndex="finished" width="150" formatter="date('Y-m-d H:i:s')"/>
            <ext-column :text="i18nd(`vue-ext`, `Runtime (sec.)`)" dataIndex="runtime_text" sortable="false" width="150" align="right"/>

            <ext-column :text="i18nd(`vue-ext`, `Exception`)" dataIndex="is_exception_text" sorter='{"property":"is_exception"}' cell='{"encodeHtml":false}' width="100" align="center"/>

            <ext-column :text="i18nd(`vue-ext`, `Status`)" dataIndex="status_label" sortable="false" cell='{"encodeHtml":false}' width="100" align="center"/>

            <ext-column :text="i18nd(`vue-ext`, `Status text`)" dataIndex="status_text" sortable="false" flex="1"/>
        </ext-grid>
    </ext-dialog>
</template>

<script>
import ApiCallLogEntryModel from "#vue/models/api-call-log/entry";

export default {
    data () {
        return {
            "title": "API call log",
        };
    },

    mounted () {
        this.store = Ext.create( "Ext.data.Store", {
            "model": ApiCallLogEntryModel,
            "autoLoad": false,
            "pageSize": 50,
        } );
    },

    "methods": {
        gridReady ( e ) {
            var grid = ( this.grid = e.detail.cmp );

            grid.setPlugins( ["autopaging", "gridviewoptions"] );

            // grid.setColumnMenu( null );

            this.grid.setStore( this.store );
        },

        setRecord ( record ) {
            this.title = `API call log for Method "${record.id}"`;

            this.store.addFilter(
                {
                    "property": "method_id",
                    "operator": "=",
                    "value": record.getId(),
                },
                false
            );
        },

        async refresh () {
            this.store.loadPage( 1 );
        },
    },
};
</script>

<template>
    <ext-dialog closeAction="hide" height="95%" layout="fit" scrollable="true" :title="title" viewModel="true" width="95%">
        <ext-toolbar docked="top">
            <ext-spacer/>
            <ext-button iconCls="fa-solid fa-redo" :text="i18nd(`vue-ext`, `Refresh`)" @tap="refresh"/>
        </ext-toolbar>

        <ext-grid ref="grid" layout="fit" multicolumnSort="true" @ready="gridReady">
            <ext-column dataIndex="started" formatter='date("dateStyle:short,timeStyle:short")' :text="i18nd(`vue-ext`, `Started`)" width="150"/>
            <ext-column dataIndex="finished" formatter='date("dateStyle:short,timeStyle:short")' :text="i18nd(`vue-ext`, `Finished`)" width="150"/>
            <ext-column align="right" dataIndex="runtime_text" sortable="false" :text="i18nd(`vue-ext`, `Runtime (sec.)`)" width="150"/>

            <ext-column align="center" cell='{"encodeHtml":false}' dataIndex="is_exception_text" sorter='{"property":"is_exception"}' :text="i18nd(`vue-ext`, `Exception`)" width="100"/>

            <ext-column align="center" cell='{"encodeHtml":false}' dataIndex="status_label" sortable="false" :text="i18nd(`vue-ext`, `Status`)" width="100"/>

            <ext-column dataIndex="status_text" flex="1" sortable="false" :text="i18nd(`vue-ext`, `Status text`)"/>
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

<template>
    <ext-dialog height="95%" layout="fit" scrollable="true" :title="title" viewModel="true" width="95%">
        <CardsPanel ref="cardsPanel" :store="store" @reload="reload">
            <template #docked>
                <ext-toolbar docked="top">
                    <ext-spacer/>
                    <ext-button iconCls="fa-solid fa-redo" :text="i18nd(`vue-ext`, `Refresh`)" @tap="reload"/>
                </ext-toolbar>
            </template>

            <template #data>
                <ext-grid ref="grid" layout="fit" multicolumnSort="true" @ready="gridReady">
                    <ext-column dataIndex="started" formatter='date("dateStyle:short,timeStyle:short")' :text="i18nd(`vue-ext`, `Started`)" width="150"/>
                    <ext-column dataIndex="finished" formatter='date("dateStyle:short,timeStyle:short")' :text="i18nd(`vue-ext`, `Finished`)" width="150"/>
                    <ext-column align="right" dataIndex="runtime_text" sortable="false" :text="i18nd(`vue-ext`, `Runtime (sec.)`)" width="150"/>

                    <ext-column align="center" cell='{"encodeHtml":false}' dataIndex="is_exception_text" sorter='{"property":"is_exception"}' :text="i18nd(`vue-ext`, `Exception`)" width="100"/>

                    <ext-column align="center" cell='{"encodeHtml":false}' dataIndex="status_label" sortable="false" :text="i18nd(`vue-ext`, `Status`)" width="100"/>

                    <ext-column dataIndex="status_text" flex="1" sortable="false" :text="i18nd(`vue-ext`, `Status text`)"/>
                </ext-grid>
            </template>
        </CardsPanel>
    </ext-dialog>
</template>

<script>
import CardsPanel from "#src/components/cards.panel";
import EntryModel from "./models/entry";

export default {
    "components": { CardsPanel },

    "props": {
        "methodId": {
            "type": String,
            "required": true,
        },
    },

    "computed": {
        title () {
            return this.i18nd( "vue-ext", `API call log for method "${this.methodId}"` );
        },
    },

    created () {
        this.store = Ext.create( "Ext.data.Store", {
            "model": EntryModel,
            "autoLoad": false,
            "pageSize": 50,
            "filters": [
                {
                    "property": "method_id",
                    "operator": "=",
                    "value": this.methodId,
                },
            ],
        } );
    },

    "methods": {
        gridReady ( e ) {
            var grid = ( this.grid = e.detail.cmp );

            grid.setPlugins( ["autopaging", "gridviewoptions"] );

            // grid.setColumnMenu( null );

            this.grid.setStore( this.store );
        },

        async reload () {
            this.store.loadPage( 1 );
        },
    },
};
</script>

<template>
    <ext-dialog height="95%" layout="fit" scrollable="true" :title="title" viewModel="true" width="95%">
        <CardsPanel ref="cardsPanel" :store="store" @reload="reload">
            <template #docked>
                <ext-toolbar docked="top">
                    <ext-button :text="i18nd(`vue-ext`, `Clear exceptions`)" @tap="_clearExceptions"/>
                    <ext-spacer/>
                    <ext-button iconCls="fa-solid fa-redo" :text="i18nd(`vue-ext`, `Refresh`)" @tap="reload"/>
                </ext-toolbar>
            </template>

            <template #data>
                <ext-grid ref="grid" layout="fit" multicolumnSort="true" @ready="gridReady">
                    <ext-column dataIndex="date" formatter='date("dateStyle:short,timeStyle:short")' :text="i18nd(`vue-ext`, `Started`)" width="150"/>

                    <ext-column align="right" dataIndex="duration" sortable="false" :text="i18nd(`vue-ext`, `Duration (ms)`)" width="150"/>

                    <ext-column align="center" dataIndex="status" sortable="false" :text="i18nd(`vue-ext`, `Status`)" width="100"/>

                    <ext-column dataIndex="status_text" flex="1" sortable="false" :text="i18nd(`vue-ext`, `Status text`)"/>
                </ext-grid>
            </template>
        </CardsPanel>
    </ext-dialog>
</template>

<script>
import CardsPanel from "#src/components/cards.panel";
import ExceptionModel from "./models/exception";

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
            return this.i18nd( "vue-ext", msgid`Exceptions log for the API method "${this.methodId}"` );
        },
    },

    created () {
        this.store = Ext.create( "Ext.data.Store", {
            "model": ExceptionModel,
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

        async _clearExceptions () {
            const res = await this.$api.call( "administration/api-status/clear-api-method-exceptions", this.methodId );

            if ( res.ok ) {
                this.store.removeAll();
            }
            else {
                this.$utils.toast( res );
            }
        },
    },
};
</script>

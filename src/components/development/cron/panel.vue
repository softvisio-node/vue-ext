<template>
    <CardsPanel ref="cards" :store="store" @refresh="refresh">
        <template #docked>
            <ext-toolbar docked="top">
                <ext-spacer/>
                <ext-button iconCls="fa-solid fa-redo" :text="i18nd(`vue-ext`, `Refresh`)" @tap="refresh"/>
            </ext-toolbar>
        </template>

        <template #data>
            <ext-grid layout="fit" multicolumnSort="true" @ready="_gridReady">
                <ext-column dataIndex="module" :text="i18nd(`vue-ext`, `Module`)" width="150"/>

                <ext-column dataIndex="name" :text="i18nd(`vue-ext`, `Name`)" width="150"/>

                <ext-column dataIndex="next_start" :text="i18nd(`vue-ext`, `Next start`)" width="150"/>

                <ext-column dataIndex="last_start" :text="i18nd(`vue-ext`, `Last start`)" width="150"/>

                <ext-column dataIndex="error" flex="1" :text="i18nd(`vue-ext`, `Error`)"/>
            </ext-grid>
        </template>
    </CardsPanel>
</template>

<script>
import TaskModel from "./models/task";
import CardsPanel from "#src/components/cards.panel";

export default {
    "components": { CardsPanel },

    created () {
        this.store = Ext.create( "Ext.data.Store", {
            "model": TaskModel,
            "autoLoad": false,
            "pageSize": null,
            "remoteSort": false,
            "remoteFilter": false,
        } );
    },

    "methods": {
        _gridReady ( e ) {
            var grid = e.detail.cmp;

            grid.setStore( this.store );
        },

        async refresh () {
            this.$refs.cards.mask();

            this.store.reload();

            this.$refs.cards.unmask();
        },
    },
};
</script>

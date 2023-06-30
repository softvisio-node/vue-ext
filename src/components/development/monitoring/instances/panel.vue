<template>
    <CardsPanel ref="cardsPanel" @refresh="refresh">
        <template #docked>
            <ext-toolbar docked="top">
                <ext-searchfield :placeholder="i18nd(`vue-ext`, `Search for instances`)" width="200" @change="_search"/>
                <ext-spacer width="20"/>
                <ext-spacer/>
                <ext-togglefield :label="i18nd(`vue-ext`, `Auto refresh`)" labelAlign="right" @change="autoRefreshChange"/>
                <ext-button ref="refreshButton" iconCls="fa-solid fa-redo" :text="i18nd(`vue-ext`, `Refresh`)" @tap="refresh"/>
            </ext-toolbar>

            <ext-panel collapsed="true" collapsible="right" docked="right" layout="fit" resizable='{"edges":"west","split":true}' :title="i18nd(`vue-ext`, `Latest charts`)" width="500">
                <LatestPanel ref="latestPanel" :record="selectedRecord"/>
            </ext-panel>
        </template>

        <template #data>
            <ext-grid ref="grid" itemConfig='{"viewModel":true}' multicolumnSort="true" @ready="_ready">
                <ext-column dataIndex="instance_type" flex="1" :text="i18nd(`vue-ext`, `Instance type`)"/>
                <ext-column dataIndex="memory_total" :text="i18nd(`vue-ext`, `Memory total`)" width="120" @ready="_colReady"/>
                <ext-column dataIndex="memory_free" :text="i18nd(`vue-ext`, `Memory free`)" width="120" @ready="_colReady"/>
                <ext-column dataIndex="memory_rss" :text="i18nd(`vue-ext`, `Memory rss`)" width="120" @ready="_colReady"/>
                <ext-column dataIndex="fs_total" :text="i18nd(`vue-ext`, `FS total`)" width="120" @ready="_colReady"/>
                <ext-column dataIndex="fs_free" :text="i18nd(`vue-ext`, `FS free`)" width="120" @ready="_colReady"/>

                <ext-column width="40" @ready="_actionColReady"/>
            </ext-grid>
        </template>
    </CardsPanel>
</template>

<script>
import CardsPanel from "#src/components/cards.panel";
import InstanceModel from "./models/instance";
import LatestPanel from "./latest.panel";
import HistoricalDialog from "./historical.dialog";

const DEFAULT_AUTOREFRESH_INTERVAL = 60_000;

export default {
    "components": { CardsPanel, LatestPanel },

    data () {
        return {
            "selectedRecord": null,
        };
    },

    created () {
        this.store = new Ext.data.Store( {
            "model": InstanceModel,
            "autoLoad": false,
            "pageSize": null,
            "remoteSort": false,
            "remoteFilter": false,
            "sorters": [
                {
                    "property": "calls",
                    "direction": "DESC",
                },
            ],
        } );
    },

    unmounted () {
        this._stopAutoRefresh();
    },

    "methods": {

        // public
        async refresh () {
            const cardsPanel = this.$refs.cardsPanel;

            cardsPanel.mask();

            this._stopAutoRefresh();

            const res = await this.$api.call( "development/monitoring/instances/get-instances" );

            this._startAutoRefresh();

            cardsPanel.setResult( res );

            if ( res.ok ) this.store.loadRawData( res.data );
        },

        async showHistoricalDialog ( button ) {
            const record = button.up( "gridrow" ).getRecord();

            const cmp = await this.$mount( HistoricalDialog, {
                "props": {
                    record,
                },
            } );

            cmp.ext.show();
        },

        // protected
        _ready ( e ) {
            const cmp = e.detail.cmp;

            cmp.setStore( this.store );
        },

        _colReady ( e ) {
            const cmp = e.detail.cmp;

            cmp.setRenderer( value => this.$app.locale.formatDigitalSize( value ) );
        },

        _actionColReady ( e ) {
            var cmp = e.detail.cmp;

            cmp.setCell( {
                "xtype": "widgetcell",
                "widget": {
                    "xtype": "container",
                    "layout": { "type": "hbox", "pack": "end", "align": "center" },
                    "items": [
                        {
                            "xtype": "button",
                            "iconCls": "fa-solid fa-chart-line",
                            "tooltip": this.i18nd( `vue-ext`, `Historical charts` ),
                            "handler": this.showHistoricalDialog.bind( this ),
                        },
                    ],
                },
            } );
        },

        _search ( e ) {
            const value = e.detail.newValue.trim();

            if ( value !== "" ) {
                this.store.addFilter( {
                    "property": "instance_type",
                    "operator": "like",
                    value,
                } );
            }
            else {
                this.store.removeFilter( "instance_type" );
            }
        },

        autoRefreshChange ( e ) {
            const val = e.detail.newValue;

            if ( val ) {
                this.autoRefreshEnabled = true;

                this._startAutoRefresh();
            }
            else {
                this.autoRefreshEnabled = false;

                this._stopAutoRefresh();
            }
        },

        _startAutoRefresh () {
            this._stopAutoRefresh();

            if ( !this.autoRefreshEnabled ) return;

            this.autoRefreshInterval = setInterval( () => {
                this.refresh();

                this.$refs.latestPanel.refresh();
            }, DEFAULT_AUTOREFRESH_INTERVAL );
        },

        _stopAutoRefresh () {
            clearInterval( this.autoRefreshInterval );

            this.autoRefreshInterval = null;
        },
    },
};
</script>

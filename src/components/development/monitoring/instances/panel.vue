<template>
    <CardsPanel ref="cardsPanel" @refresh="refresh">
        <template #docked>
            <ext-toolbar docked="top">
                <ext-searchfield :placeholder="l10n(`Search for instances`)" width="200" @change="_search"/>
                <ext-spacer width="20"/>
                <ext-spacer/>
                <ext-togglefield :label="l10n(`Auto refresh`)" labelAlign="right" @change="autoRefreshChange"/>
                <ext-button ref="refreshButton" iconCls="fa-solid fa-redo" :text="l10n(`Refresh`)" @tap="refresh"/>
            </ext-toolbar>

            <ext-panel collapsed="true" collapsible="right" docked="right" layout="fit" resizable='{"edges":"west","snap":200,"split":true}' :title="l10n(`Latest charts`)" width="400">
                <CharstPanel ref="chartsPanel" period="1 hour" :record="selectedRecord">
                    <template #toolbar>
                        <ext-button iconCls="fa-solid fa-expand" :text="l10n(`Open charts`)" @tap="showChartsDialog"/>
                    </template>
                </CharstPanel>
            </ext-panel>
        </template>

        <template #data>
            <ext-grid ref="grid" itemConfig='{"viewModel":true}' multicolumnSort="true" @ready="_ready">
                <ext-column dataIndex="instance_type" flex="1" :text="l10n(`Instance type`)"/>

                <ext-column dataIndex="memory_total" :text="l10n(`Total memory`)" width="120" @ready="_colReady"/>

                <ext-column dataIndex="memory_used_text" sorter='{"property":"memory_used"}' :text="l10n(`Used memory`)" width="150"/>

                <ext-column dataIndex="memory_rss_text" sorter='{"property":"memory_rss"}' :text="l10n(`RSS memory`)" width="150"/>

                <ext-column dataIndex="fs_total" :text="l10n(`FS total`)" width="120" @ready="_colReady"/>

                <ext-column dataIndex="fs_used_text" sorter='{"property":"fsy_used"}' :text="l10n(`FS used`)" width="150"/>

                <ext-column width="40" @ready="_actionColReady"/>
            </ext-grid>
        </template>
    </CardsPanel>
</template>

<script>
import CardsPanel from "#src/components/cards.panel";
import InstanceModel from "./models/instance";
import ChartsDialog from "./charts.dialog";
import CharstPanel from "./charts.panel";

const DEFAULT_AUTOREFRESH_INTERVAL = 60_000;

export default {
    "components": { CardsPanel, CharstPanel },

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

        async showChartsDialog ( row, button ) {
            const record = row === "row" ? button.up( "gridrow" )?.getRecord() : this.selectedRecord;

            if ( !record ) return;

            const cmp = await this.$mount( ChartsDialog, {
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

            cmp.on( "select", ( grid, selection ) => ( this.selectedRecord = selection[0] ) );
        },

        _colReady ( e ) {
            const cmp = e.detail.cmp;

            cmp.setRenderer( value => this.$app.locale.formatNumber( value / 1024 ** 3, "style:unit,unit:gigabyte" ) );
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
                            "tooltip": this.l10n( `Open charts` ),
                            "handler": this.showChartsDialog.bind( this, "row" ),
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

                this.$refs.chartsPanel.refresh();
            }, DEFAULT_AUTOREFRESH_INTERVAL );
        },

        _stopAutoRefresh () {
            clearInterval( this.autoRefreshInterval );

            this.autoRefreshInterval = null;
        },
    },
};
</script>

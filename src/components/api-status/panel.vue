<template>
    <CardsPanel ref="cardsPanel" @refresh="refresh">
        <template #docked>
            <ext-toolbar docked="top">
                <ext-searchfield :placeholder="i18nd(`vue-ext`, `Search for methods by name`)" width="200" @change="_search"/>
                <ext-spacer width="20"/>
                <ext-button ref="periodButton" @ready="_periodButtonReady"/>
                <ext-spacer/>
                <ext-togglefield :label="i18nd(`vue-ext`, `Auto refresh`)" labelAlign="right" @change="autoRefreshChange"/>
                <ext-button ref="refreshButton" iconCls="fa-solid fa-redo" :text="i18nd(`vue-ext`, `Refresh`)" @tap="refresh"/>
            </ext-toolbar>

            <ext-panel collapsed="true" collapsible="right" docked="right" layout="fit" resizable='{"edges":"west","split":true}' :title="i18nd(`vue-ext`, `Latest charts`)" width="500">
                <LatestPanel ref="latestPanel" :methodId="selectedMethodId"/>
            </ext-panel>
        </template>

        <template #data>
            <ext-lockedgrid ref="grid" itemConfig='{"viewModel":true}' multicolumnSort="true" @ready="_ready">
                <!-- <ext-column dataIndex="id" flex="1" locked="left" minWidth="290" :text="i18nd(`vue-ext`, `Method name`)"/> -->

                <!-- <ext-column align="right" dataIndex="active_calls" :text="i18nd(`vue-ext`, `Active calls`)" width="100"/> -->

                <!-- <ext-column align="right" dataIndex="calls_text" sorter='{"property":"calls"}' :text="i18nd(`vue-ext`, `Calls`)" width="140"/> -->

                <!-- <ext-column align="right" dataIndex="duration_per_call_text" sorter='{"property":"duration_per_call"}' :text="i18nd(`vue-ext`, `Duration / call (ms)`)" width="140"/> -->

                <!-- <ext-column align="right" dataIndex="duration_text" sorter='{"property":"duration_share"}' :text="i18nd(`vue-ext`, `Duration (%)`)" width="140"/> -->

                <!-- <ext-column align="right" dataIndex="exceptions_text" sorter='{"property":"exceptions"}' :text="i18nd(`vue-ext`, `Exceptions`)" width="140"/> -->

                <!-- <ext-column align="right" dataIndex="exceptions_per_call_text" sorter='{"property":"exceptions_per_call"}' :text="i18nd(`vue-ext`, `Exceptions / call (%)`)" width="140"/> -->

                <!-- <ext-column locked="right" width="80" @ready="_actionColReady"/> -->
            </ext-lockedgrid>
        </template>
    </CardsPanel>
</template>

<script>
import CardsPanel from "#src/components/cards.panel";
import MethodModel from "./models/method";
import LatestPanel from "./latest.panel";
import HistoricalDialog from "./historical.dialog";
import ExceptionsDialog from "./exceptions.dialog";

const DEFAULT_AUTOREFRESH_INTERVAL = 60_000;

const periods = [1, 3, 7, 14, 30],
    defaultPeriod = 3;

export default {
    "components": { CardsPanel, LatestPanel },

    data () {
        return {
            "selectedMethodId": "",
        };
    },

    created () {
        this.store = new Ext.data.Store( {
            "model": MethodModel,
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
        this.autoRefreshEnabled = true;

        this._stopAutoRefresh();
    },

    "methods": {

        // public
        async refresh () {
            const cardsPanel = this.$refs.cardsPanel;

            cardsPanel.mask();

            this._stopAutoRefresh();

            const res = await this.$api.call( "administration/api-status/get-api-methods", { "period": this.period } );

            this._startAutoRefresh();

            cardsPanel.setResult( res );

            if ( res.ok ) this.store.loadRawData( res.data );
        },

        async showHistoricalDialog ( button ) {
            const record = button.up( "gridrow" ).getRecord();

            const cmp = await this.$mount( HistoricalDialog, {
                "props": {
                    "methodId": record.id,
                },
            } );

            cmp.ext.show();
        },

        async showExceptions ( button ) {
            const record = button.up( "gridrow" ).getRecord();

            const cmp = await this.$mount( ExceptionsDialog, {
                "props": {
                    "methodId": record.id,
                },
            } );

            cmp.ext.show();
        },

        // protected
        _ready ( e ) {
            const cmp = e.detail.cmp;

            // cmp.setColumnMenu( null );

            cmp.getRegion( "left" ).getGrid().setSelectable( {
                "mode": "single",
            } );

            cmp.getRegion( "left" )
                .getGrid()
                .on( "select", ( grid, selection ) => ( this.selectedMethodId = selection.id ) );

            cmp.setStore( this.store );

            cmp.setColumns( [
                {
                    "dataIndex": "id",
                    "flex": 1,
                    "minWidth": 290,
                    "text": this.i18nd( `vue-ext`, `Method name` ),
                    "locked": "left",
                },
                {
                    "align": "right",
                    "dataIndex": "active_calls",
                    "text": this.i18nd( `vue-ext`, `Active calls` ),
                    "width": 100,
                },
                {
                    "align": "right",
                    "dataIndex": "calls_text",
                    "sorter": { "property": "calls" },
                    "text": this.i18nd( `vue-ext`, `Calls` ),
                    "width": 140,
                },
                {
                    "align": "right",
                    "dataIndex": "duration_per_call_text",
                    "sorter": { "property": "duration_per_call" },
                    "text": this.i18nd( `vue-ext`, `Duration / call (ms)` ),
                    "width": 140,
                },
                {
                    "align": "right",
                    "dataIndex": "duration_text",
                    "sorter": { "property": "duration_share" },
                    "text": this.i18nd( `vue-ext`, `Duration (%)` ),
                    "width": 140,
                },
                {
                    "align": "right",
                    "dataIndex": "exceptions_text",
                    "sorter": { "property": "exceptions" },
                    "text": this.i18nd( `vue-ext`, `Exceptions` ),
                    "width": 140,
                },
                {
                    "align": "right",
                    "dataIndex": "exceptions_per_call_text",
                    "sorter": { "property": "exceptions_per_call" },
                    "text": this.i18nd( `vue-ext`, `Exceptions / call (%)` ),
                    "width": 140,
                },
                {
                    "width": 80,
                    "locked": "left",
                    "listeners": {
                        "added": cmp => this._actionColReady( { "detail": { cmp } } ),
                    },
                },
            ] );
        },

        _periodButtonReady ( e ) {
            const cmp = e.detail.cmp;

            const menu = [];

            this.period = defaultPeriod;

            for ( const period of periods ) {
                const text = this.i18nd( `vue-ext`, msgid`${period} day`, msgid`${period} days`, period );

                if ( period === defaultPeriod ) cmp.setText( this.i18nd( `vue-ext`, `Period` ) + ": " + text );

                menu.push( {
                    "xtype": "menuradioitem",
                    "value": period,
                    text,
                    "group": "period",
                    "checked": period === defaultPeriod,
                    "handler": this._setPeriod.bind( this ),
                } );
            }

            cmp.setMenu( menu );
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
                        {
                            "xtype": "button",
                            "iconCls": "fa-solid fa-triangle-exclamation",
                            "tooltip": this.i18nd( `vue-ext`, `Exceptions log` ),
                            "handler": this.showExceptions.bind( this ),
                        },
                    ],
                },
            } );
        },

        _search ( e ) {
            const value = e.detail.newValue.trim();

            if ( value !== "" ) {
                this.store.addFilter( {
                    "property": "id",
                    "operator": "like",
                    value,
                } );
            }
            else {
                this.store.removeFilter( "id" );
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

        _setPeriod ( menuItem ) {
            const period = menuItem.getValue();

            if ( this.period === period ) return;

            this.period = period;

            this.$refs.periodButton.ext.setText( this.i18nd( `vue-ext`, `Period` ) + ": " + menuItem.getText() );

            this.refresh();
        },
    },
};
</script>

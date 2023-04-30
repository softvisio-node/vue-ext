<template>
    <ext-panel layout="card" @ready="_ready">
        <!-- default card -->
        <ext-panel ref="defaultCard" :html="defaultMessage" layout="center" style="text-align: center"/>

        <!-- no data card -->
        <ext-panel ref="noDataCard" :html="noDataMessageText" layout="center" style="text-align: center"/>

        <!-- error card -->
        <ext-container ref="errorCard" layout='{"align":"center","pack":"center","type":"vbox"}' style="text-align: center">
            <ext-container :html="i18nd(`vue-ext`, `Unable to load data`)"/>
            <ext-container ref="errorMessage"/>
            <ext-container height="10"/>
            <ext-button iconCls="fa-solid fa-redo" :text="i18nd(`vue-ext`, `Refresh`)" ui="action" @tap="refresh"/>
        </ext-container>

        <!-- data card -->
        <ext-panel ref="dataCard" layout="fit">
            <slot name="data"/>
        </ext-panel>

        <slot name="docked"/>
    </ext-panel>
</template>

<script>
import loadMask from "#vue/load-mask";

export default {
    "props": {
        "store": {
            "type": Object,
            "default": null,
        },
        "showErrorMessage": {
            "type": Boolean,
            "default": true,
        },
        "defaultMessage": {
            "type": String,
            "default": "",
        },
        "noDataMessage": {
            "type": String,
            "default": "",
        },
        "loadMask": {
            "type": Object,
            "default": loadMask,
        },
        "refreshOnRender": {
            "type": Boolean,
            "default": true,
        },
        "autoMask": {
            "type": Boolean,
            "default": true,
        },
    },

    "emits": ["render", "refresh", "storeLoad"],

    "computed": {
        noDataMessageText () {
            return this.noDataMessage || this.i18nd( `vue-ext`, `No data match search criteria` );
        },
    },

    mounted () {
        if ( this.store ) this.watchStore( this.store );
    },

    unmounted () {
        this.unwatchStore( this.store );
    },

    "methods": {
        _ready ( e ) {
            const cmp = ( this.ext = e.detail.cmp );

            if ( cmp.rendered ) {
                this._onRender();
            }
            else {
                cmp.afterRender = () => this._onRender();
            }
        },

        _onRender () {
            this.$emit( "render" );

            if ( this.refreshOnRender ) this.$emit( "refresh" );
        },

        refresh () {
            if ( this.autoMask ) this.mask();

            this.$emit( "refresh" );
        },

        mask ( mask ) {
            this.ext.mask( mask || this.loadMask );
        },

        unmask () {
            this.ext.unmask();
        },

        watchStore ( store ) {
            this._store = store;
            this._storeLoadCallback = this._onStoreLoad.bind( this );
            this._storeDataChangedCallback = this._onStoreDataChanged.bind( this );

            this._store.on( "load", this._storeLoadCallback );
            this._store.on( "datachanged", this._storeDataChangedCallback );
        },

        unwatchStore () {
            if ( !this._store ) return;

            this._store.removeListener( "load", this._storeLoadCallback );
            this._store.removeListener( "datachanged", this._storeDataChangedCallback );

            this._store = null;
            this._storeLoadCallback = null;
            this._storeDataChangedCallback = null;
        },

        setResult ( res ) {
            if ( !res.ok ) {
                this.showErrorCard( res.statusText );
            }
            else {
                this.showDataCard();
            }
        },

        showDefaultCard () {
            this.ext.setActiveItem( this.$refs.defaultCard.ext );

            if ( this.autoMask ) this.unmask();
        },

        showErrorCard ( message ) {
            if ( message && this.showErrorMessage ) {
                this.$refs.errorMessage.ext.setHtml( message + "" );
            }
            else {
                this.$refs.errorMessage.ext.setHtml( "" );
            }

            this.ext.setActiveItem( this.$refs.errorCard.ext );

            if ( this.autoMask ) this.unmask();
        },

        showNoDataCard () {
            this.ext.setActiveItem( this.$refs.noDataCard.ext );

            if ( this.autoMask ) this.unmask();
        },

        showDataCard () {
            this.ext.setActiveItem( this.$refs.dataCard.ext );

            if ( this.autoMask ) this.unmask();
        },

        _onStoreLoad ( store, records, success, eOpts ) {
            this.$emit( "storeLoad", store, records, success, eOpts );

            if ( !success ) {
                this.showErrorCard( eOpts );
            }
            else if ( !store.getCount() ) {
                this.showNoDataCard();
            }
            else {
                this.showDataCard();
            }
        },

        _onStoreDataChanged ( store ) {
            if ( !store.getCount() ) {
                this.showNoDataCard();
            }
            else {
                this.showDataCard();
            }
        },
    },
};
</script>

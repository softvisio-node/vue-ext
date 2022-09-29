<template>
    <ext-panel ref="cards" layout="card" viewModel="true" @ready="_ready">
        <!-- no data card -->
        <ext-panel ref="noDataCard" :html="i18nd(`vue-ext`, `No data match search criteria`)" layout="center"/>

        <!-- error card -->
        <ext-container ref="errorCard" layout='{"align":"center","pack":"center","type":"vbox"}' style="text-align: center">
            <ext-container :html="i18nd(`vue-ext`, `Unable to load data`)"/>
            <ext-container ref="errorMessage"/>
            <ext-button iconCls="fa-solid fa-redo" :text="i18nd(`vue-ext`, `Refresh`)" ui="action" @tap="reload"/>
        </ext-container>

        <ext-panel ref="dataCard" layout="fit">
            <slot name="data"/>
        </ext-panel>

        <slot name="items"/>
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
    },

    "emits": ["reload", "storeLoad", "storeDataChange"],

    mounted () {
        if ( this.store ) this.watchStore( this.store );
    },

    unmounted () {
        this.unwatchStore( this.store );
    },

    "methods": {
        reload () {
            this.$emit( "reload" );
        },

        mask ( mask ) {
            this.$refs.cards.ext.mask( mask ?? loadMask );
        },

        unmask () {
            this.$refs.cards.ext.unmask();
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

            this._store.off( "load", this._storeLoadCallback );
            this._store.off( "datachanged", this._storeDataChangedCallback );

            this._store = null;
            this._storeLoadCallback = null;
            this._storeDataChangedCallback = null;
        },

        setResult ( res ) {
            if ( !res.ok ) {
                this.showErrorCard( res );
            }
            else {
                this.showDataCard();
            }
        },

        showErrorCard ( message ) {
            if ( message && this.showErrorMessage ) {
                this.$refs.errorMessage.ext.setHtml( message + "" );
            }
            else {
                this.$refs.errorMessage.ext.setHtml( "" );
            }

            this.$refs.cards.ext.setActiveItem( this.$refs.errorCard.ext );
        },

        showNoDataCard () {
            this.$refs.cards.ext.setActiveItem( this.$refs.noDataCard.ext );
        },

        showDataCard () {
            this.$refs.cards.ext.setActiveItem( this.$refs.dataCard.ext );
        },

        // XXX event args
        _onStoreLoad ( store, records, success, eOpts ) {
            this.$emit( "storeLoad", store, records, success, eOpts );

            if ( !success ) {
                this.showErrorCard();
            }
            else if ( !this.store.count() ) {
                this.showNoDataCard();
            }
            else {
                this.showDataCard();
            }
        },

        // XXX event args
        _onStoreDataChanged ( store, eOpts ) {
            this.$emit( "storeDataChange", store, eOpts );

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

<template>
    <ext-dialog height="350" :title="l10nd(`vue-ext`, `Authorization`)" width="300" @ready="_ready">
        <ext-container :html="l10nd(`vue-ext`, `Authorization is required to perform this operation. Please, authorize and then repeat action again.`)"/>

        <ext-fieldpanel ref="form" @ready="_formReady">
            <ext-passwordfield errorTarget="under" :label="l10nd(`vue-ext`, `Password`)" name="password" :placeholder="l10nd(`vue-ext`, `Enter password`)" required="true" revealable="true"/>
        </ext-fieldpanel>

        <!-- oauth -->
        <OauthContainer margin="10 0 0 0" @tap="_oauthTap"/>

        <ext-toolbar docked="bottom" layout='{"pack":"end","type":"hbox"}'>
\ <ext-button :text="l10nd(`vue-ext`, `Authorize`)" ui="action" @tap="_submit"/>
</ext-toolbar>
    </ext-dialog>
</template>

<script>
import loadMask from "#src/load-mask";
import OauthContainer from "#src/components/oauth.container";

export default {
    "components": { OauthContainer },

    "methods": {
        _ready ( e ) {
            this.ext = e.detail.cmp;

            this.ext.on( "destroy", () => {
                if ( this._resolve ) this._resolve( false );
            } );
        },

        _formReady ( e ) {
            const cmp = e.detail.cmp;

            cmp.setKeyMap( { "ENTER": { "handler": this._submit.bind( this ) } } );
        },

        async show () {
            this.ext.show();

            return new Promise( resolve => {
                this._resolve = resolve;
            } );
        },

        _submit () {
            const form = this.$refs.form.ext;

            if ( !form.validate() ) return;

            const values = form.getValues();

            this._authorize( { "password": values.password } );
        },

        _oauthTap ( oauthProvider ) {
            this._authorize( { oauthProvider } );
        },

        async _authorize ( options ) {
            this.ext.mask( loadMask );

            const res = await this.$app.authorize( options );

            this.ext.unmask();

            if ( res.ok ) {
                this.$utils.toast( this.l10nd( `vue-ext`, "Authorized" ) );

                this._resolve( true );

                this._resolve = null;

                this.ext.close();
            }
            else {
                this.$utils.toast( res );
            }
        },
    },
};
</script>

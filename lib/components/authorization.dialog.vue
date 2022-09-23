<template>
    <ext-dialog closeAction="hide" height="350" :title="i18nd(`vue-ext`, `Authorization`)" width="300" @ready="_ready">
        <ext-container :html="i18nd(`vue-ext`, `Authorization is required to perform this operation. Please, authorize and then repeat action again.`)"/>

        <ext-fieldpanel ref="form" defaults='{"labelAlign":"top"}' @ready="_formReady">
            <ext-passwordfield errorTarget="under" :label="i18nd(`vue-ext`, `Password`)" name="password" :placeholder="i18nd(`vue-ext`, `Enter password`)" required="true" revealable="true"/>
        </ext-fieldpanel>

        <ext-toolbar docked="bottom" layout='{"pack":"end","type":"hbox"}'>
\ <ext-button :text="i18nd(`vue-ext`, `Authorize`)" ui="action" @tap="_submit"/>
</ext-toolbar>
    </ext-dialog>
</template>

<script>
import loadMask from "#lib/load-mask";

var shown = false;

export default {
    "methods": {
        _ready ( e ) {
            this.ext = e.detail.cmp;

            this.ext.on( "hide", () => {
                shown = false;

                this.$refs.form.ext.reset();
            } );
        },

        _formReady ( e ) {
            const cmp = e.detail.cmp;

            cmp.setKeyMap( { "ENTER": { "handler": this._submit.bind( this ) } } );
        },

        show () {
            if ( shown ) return;

            this.ext.show();
        },

        close () {
            this.ext.hide();
        },

        async _submit () {
            const form = this.$refs.form.ext;

            if ( !form.validate() ) return;

            const values = form.getValues();

            this.ext.mask( loadMask );

            const res = await this.$api.call( "session/authorize", values.password );

            this.ext.unmask();

            if ( res.ok ) {
                this.$utils.toast( this.i18nd( `vue-ext`, "Authorized" ) );

                this.close();
            }
            else {
                this.$utils.toast( res );
            }
        },
    },
};
</script>

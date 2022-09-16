<template>
    <ext-dialog closeAction="hide" height="300" :title="i18nd(`vue-ext`, `Authorization`)" width="300" @ready="_ready">
        <ext-container :html="i18nd(`vue-ext`, `Authorixation is required to perform this operation.`)" style="text-align: center"/>

        <ext-fieldpanel ref="form" defaults='{"labelAlign":"left","labelWidth":120}' @ready="formReady">
            <ext-passwordfield :label="i18nd(`vue-ext`, `Password`)" name="password" required="true"/>
        </ext-fieldpanel>

        <ext-toolbar docked="bottom" layout='{"pack":"end","type":"hbox"}'>
\ <ext-button :text="i18nd(`vue-ext`, `Authorize`)" ui="action" @tap="submit"/>
</ext-toolbar>
    </ext-dialog>
</template>

<script>
import loadMask from "#lib/load-mask";

export default {
    "methods": {
        _ready ( e ) {
            this.ext = e.detail.cmp;

            this.ext.on( "hide", () => {
                this.$refs.form.ext.reset();
            } );
        },

        formReady ( e ) {
            var cmp = e.detail.cmp;

            cmp.setKeyMap( { "ENTER": { "handler": "submit", "scope": this } } );
        },

        close () {
            this.ext.hide();
        },

        async submit () {
            var form = this.$refs.form.ext;

            if ( !form.validate() ) return;

            var values = form.getValues();

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

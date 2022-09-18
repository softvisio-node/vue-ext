<template>
    <ext-dialog closeAction="hide" height="300" :title="title" width="300" @ready="_ready">
        <ext-fieldpanel ref="form" @ready="formReady">
            <ext-emailfield :label="i18nd(`vue-ext`, `New email address`)" name="email" :placeholder="i18nd(`vue-ext`, `Ender new email address`)" required="true" validators="email"/>
        </ext-fieldpanel>

        <ext-toolbar docked="bottom" layout='{"pack":"end","type":"hbox"}'>
\ <ext-button :text="i18nd(`vue-ext`, `Change email`)" ui="action" @tap="submit"/>
</ext-toolbar>
    </ext-dialog>
</template>

<script>
import loadMask from "#lib/load-mask";

export default {
    "computed": {
        title () {
            return this.i18nd( `vue-ext`, `Change email` );
        },
    },

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
            const form = this.$refs.form.ext;

            if ( !form.validate() ) return;

            const values = form.getValues();

            this.ext.mask( loadMask );

            const res = await this.$api.call( "account/send-email-change-token", values.email );

            this.ext.unmask();

            if ( res.ok ) {
                this.$utils.toast( this.i18nd( `vue-ext`, "Change email instructions were sent to the new email address" ) );

                this.close();
            }
            else {
                this.$utils.toast( res );
            }
        },
    },
};
</script>

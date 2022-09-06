<template>
    <ext-dialog closeAction="hide" height="400" layout="vbox" :title="i18nd(`vue-ext`, `Create API key`)" width="400" @ready="ready">
        <ext-fieldpanel ref="form" defaults='{"labelAlign":"top"}' @ready="formReady">
            <ext-textfield ref="name" :label="i18nd(`vue-ext`, `Key name`)" name="name" :placeholder="i18nd(`vue-ext`, `Enter new key name`)" required="true"/>
        </ext-fieldpanel>

        <ext-container ref="done" defaults='{"labelAlign":"top"}' hidden="true">
            <ext-spacer height="10"/>
            <ext-textareafield ref="key" height="90" :label="i18nd(`vue-ext`, `Your API access key:`)" readOnly="true" textAlign="center"/>
            <ext-container>
                <div>{{ i18nd(`vue-ext`, `Please, copy key to the clipboard and store it to the safe place. After this dialog window will be closed we were unable to show you this key again.`) }}</div>
            </ext-container>
            <ext-spacer height="5"/>
            <ext-container layout="center">
                <ext-button iconCls="fa-solid fa-copy" :text="i18nd(`vue-ext`, `Copy key to the clipboard`)" ui="action" @tap="copyToClipboard"/>
            </ext-container>
        </ext-container>

        <ext-toolbar docked="bottom">
            <ext-spacer/>
            <ext-button ref="submit" :text="i18nd(`vue-ext`, `Create key`)" ui="action" @tap="submit"/>
            <ext-button ref="close" hidden="true" :text="i18nd(`vue-ext`, `Close`)" ui="action" @tap="close"/>
        </ext-toolbar>
    </ext-dialog>
</template>

<script>
export default {
    "emits": ["created"],

    "methods": {
        async ready ( e ) {
            this.ext = e.detail.cmp;

            this.ext.on( "hide", () => {
                this.$refs.form.ext.reset();

                this.$refs.key.ext.setValue( null );

                this.$refs.name.ext.setReadOnly( false );
                this.$refs.done.ext.setHidden( true );

                this.$refs.submit.ext.setHidden( false );
                this.$refs.close.ext.setHidden( true );
            } );
        },

        formReady ( e ) {
            const cmp = e.detail.cmp;

            cmp.setKeyMap( { "ENTER": { "handler": "submit", "scope": this } } );
        },

        close () {
            this.ext.hide();
        },

        async submit () {
            var form = this.$refs.form.ext;

            if ( !form.validate() ) return;

            var vals = form.getValues();

            this.ext.mask( {
                "xtype": "loadmask",
                "message": `<div style="color:white;">Generating<br/>please wait...</div>`,
            } );

            const res = await this.$api.call( "account/tokens/create", vals.name );

            this.ext.unmask();

            if ( res.ok ) {
                this.$refs.key.ext.setValue( res.data.key );

                this.$refs.name.ext.setReadOnly( true );
                this.$refs.done.ext.setHidden( false );

                this.$refs.submit.ext.setHidden( true );
                this.$refs.close.ext.setHidden( false );

                this.$utils.toast( this.i18nd( `vue-ext`, "API key created" ) );

                this.$emit( "created" );
            }
            else {
                this.$utils.toast( res );
            }
        },

        copyToClipboard () {
            this.$utils.copyToClipboard( this.$refs.key.ext.getValue() );

            this.$utils.toast( this.i18nd( `vue-ext`, "Key copied to the clipboard" ) );
        },
    },
};
</script>

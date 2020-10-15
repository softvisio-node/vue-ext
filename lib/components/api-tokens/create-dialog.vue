<template>
    <ext-dialog title="Create API Token" width="400" height="400" displayed="true" closable="true" draggable="false" closeAction="hide" hideOnMaskTap="true" layout="vbox" @ready="ready">
        <ext-fieldpanel ref="form" defaults='{"labelAlign":"top"}' @ready="formReady">
            <ext-textfield ref="name" name="name" label="Token Name" placeholder="enter new token name" required="true"/>
        </ext-fieldpanel>

        <ext-container ref="done" defaults='{"labelAlign":"top"}' hidden="true">
            <ext-spacer height="10"/>
            <ext-textareafield ref="token" label="Your API Access Token:" readOnly="true" height="90"/>
            <ext-container>
                <div>Please, copy token to the clipboard and store it to the safe place. After this dialog window will be closed we were unable to show you this token again.</div>
            </ext-container>
            <ext-spacer height="5"/>
            <ext-container layout="center">
                <ext-button iconCls="fas fa-copy" text="Copy Token To Clipboard" ui="action" @tap="copyToClipboard"/>
            </ext-container>
        </ext-container>

        <ext-toolbar docked="bottom">
            <ext-spacer/>
            <ext-button ref="cancel" text="Cancel" ui="decline" @tap="cancel"/>
            <ext-button ref="submit" text="Create" ui="action" @tap="submit"/>
            <ext-button ref="close" text="Close" ui="action" hidden="true" @tap="cancel"/>
        </ext-toolbar>
    </ext-dialog>
</template>

<script>
export default {
    "methods": {
        async ready ( e ) {
            this.$ext = e.detail.cmp;

            this.$ext.on( "hide", () => {
                this.$refs.form.ext.reset();

                this.$refs.token.ext.setValue( null );

                this.$refs.name.ext.setReadOnly( false );
                this.$refs.done.ext.setHidden( true );

                this.$refs.cancel.ext.setHidden( false );
                this.$refs.submit.ext.setHidden( false );
                this.$refs.close.ext.setHidden( true );
            } );
        },

        formReady ( e ) {
            var cmp = e.detail.cmp;

            cmp.setKeyMap( { "ENTER": { "handler": "submit", "scope": this } } );
        },

        cancel () {
            this.$ext.hide();
        },

        async submit () {
            var form = this.$refs.form.ext;

            if ( !form.validate() ) return;

            var vals = form.getValues();

            this.$ext.mask( {
                "xtype": "loadmask",
                "message": `<div style="color:white;">Generating<br/>please wait...</div>`,
            } );

            const res = await this.$api.call( "api-tokens/create", vals.name );

            this.$ext.unmask();

            if ( res.ok ) {
                this.$refs.token.ext.setValue( res.data.token );

                this.$refs.name.ext.setReadOnly( true );
                this.$refs.done.ext.setHidden( false );

                this.$refs.cancel.ext.setHidden( true );
                this.$refs.submit.ext.setHidden( true );
                this.$refs.close.ext.setHidden( false );

                this.$.toast( "API token created" );

                this.$store.state["api-tokens"].store.loadPage( 1 );
            }
            else {
                this.$.toast( res );
            }
        },

        copyToClipboard () {
            this.$.copyToClipboard( this.$refs.token.ext.getValue() );

            this.$.toast( "Token copied to clipboard" );
        },
    },
};
</script>

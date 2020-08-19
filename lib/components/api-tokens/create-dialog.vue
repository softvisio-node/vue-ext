<template>
    <ext-dialog title="Create API Token" width="350" height="400" displayed="true" closable="true" draggable="false" closeAction="hide" hideOnMaskTap="true" @ready="ready">
        <ext-fieldpanel ref="form" defaults='{"labelAlign":"left","labelWidth":120}' @ready="formReady">
            <ext-textfield name="name" label="Name" placeholder="enter token name" required="true"/>
        </ext-fieldpanel>

        <ext-toolbar docked="bottom">
            <ext-spacer/>
            <ext-button text="Cancel" ui="decline" @tap="cancel"/>
            <ext-button text="Create" ui="action" @tap="submit"/>
        </ext-toolbar>
    </ext-dialog>
</template>

<script>
export default {
    "methods": {
        async ready ( e ) {
            this.$ext = e.detail.cmp;

            this.$ext.on( "hide", () => this.$refs.form.ext.reset() );
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
                "message": `<div style="color:white;">Uploading<br/>please wait...</div>`,
            } );

            const res = await this.$api.call( "api-keys/create", vals.name );

            this.$ext.unmask();

            if ( res.ok ) {
                this.$.toast( "API token created." );

                this.$store.state["api-keys"].store.loadPage( 1 );

                this.cancel();
            }
            else {
                this.$.toast( res );
            }
        },
    },
};
</script>

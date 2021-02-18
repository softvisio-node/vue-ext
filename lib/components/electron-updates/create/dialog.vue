<template>
    <ext-dialog title="Upload Release" width="350" height="400" closable="true" draggable="false" closeAction="hide" hideOnMaskTap="true" @ready="ready">
        <ext-fieldpanel ref="form" defaults='{"labelAlign":"left","labelWidth":120}' @ready="formReady">
            <ext-radiogroup name="platform" label="Platform" defaults='{"labelAlign":"right"}' vertical="true">
                <ext-radiofield value="win32" label="Windows" checked="true"/>
                <ext-radiofield value="linux" label="Linux"/>
                <ext-radiofield value="darwin" label="MacOS"/>
            </ext-radiogroup>

            <ext-radiogroup name="arch" label="Arch" defaults='{"labelAlign":"right"}' vertical="true">
                <ext-radiofield value="x64" label="x64" checked="true"/>
                <ext-radiofield value="x32" label="x32"/>
            </ext-radiogroup>

            <ext-emailfield name="version" label="Version" placeholder="semantic version 1.2.3" required="true"/>

            <ext-filefield ref="file" placeholder="Choose Update" required="true"/>
        </ext-fieldpanel>

        <ext-toolbar docked="bottom">
            <ext-spacer/>
            <ext-button text="Cancel" ui="decline" @tap="close"/>
            <ext-button text="Upload" ui="action" @tap="submit"/>
        </ext-toolbar>
    </ext-dialog>
</template>

<script>
export default {
    "methods": {
        async ready ( e ) {
            this.ext = e.detail.cmp;

            this.ext.on( "hide", () => this.$refs.form.ext.reset() );
        },

        formReady ( e ) {
            var cmp = e.detail.cmp;

            cmp.setKeyMap( { "ENTER": { "handler": "submit", "scope": this } } );
        },

        close () {
            this.ext.hide();
        },

        async submit () {
            var form = this.$refs.form.ext,
                file = this.$refs.file.ext.getFiles()[0];

            if ( !form.validate() ) return;

            var vals = form.getValues();

            this.ext.mask( {
                "xtype": "loadmask",
                "message": `<div style="color:white;">Uploading<br/>please wait...</div>`,
            } );

            const res = await this.$api.upload( "electron-updates/create", file, vals );

            this.ext.unmask();

            if ( res.ok ) {
                this.$utils.toast( "Release created." );

                this.$store["electron-updates"].reload();

                this.close();
            }
            else {
                this.$utils.toast( res );
            }
        },
    },
};
</script>

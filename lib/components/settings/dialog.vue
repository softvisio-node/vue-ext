<template>
    <ext-dialog :title="title" :width="width" :height="height" displayed="true" scrollable="true" closable="true" draggable="false" closeAction="hide" hideOnMaskTap="true" bodyPaddign="10" :layout="layout" viewModel="true" @ready="ready">
        <ext-panel scrollable="true" width="500" layout="fit">
            <ext-fieldpanel ref="form" modelValidation="true" layout="vbox" defaults='{"defaults":{"labelAlign":"left","labelWidth":250}}'>
                <ext-fieldset>
                    <ext-textfield label="App URL" bind="{record.app_url}"/>
                </ext-fieldset>

                <!-- SMTP -->
                <ext-fieldset title="SMTP Settings">
                    <ext-textfield label="SMTP Host" bind="{record.smtp_host}"/>
                    <ext-spinnerfield label="SMTP Port" decimals="0" minValue="1" maxValue="65535" bind="{record.smtp_port}"/>
                    <ext-textfield label="SMTP Username" bind="{record.smtp_username}"/>
                    <ext-passwordfield label="SMTP Password" bind="{record.smtp_password}"/>
                    <ext-togglefield label="SMTP TLS" bind="{record.smtp_tls}"/>

                    <ext-toolbar docked="bottom" layout='{"type":"hbox","pack":"end","required":true}'>
                        <ext-button text="Test SMTP" bind='{"disabled":"{!record.smtp_can_test}"}' @tap="testSmtp"/>
                    </ext-toolbar>
                </ext-fieldset>
            </ext-fieldpanel>

            <slot/>
        </ext-panel>
        <ext-toolbar docked="bottom" layout='{"type":"hbox","pack":"end"}'>
            <ext-button text="Cancel" ui="decline" @tap="cancel"/>
            <ext-button text="Submit" ui="action" bind='{"disabled":"{!record.dirty}"}' @tap="submit"/>
        </ext-toolbar>
    </ext-dialog>
</template>

<script>
import Model from "@/models/settings";

export default {
    "props": {
        "title": {
            "type": String,
            "default": "Settings",
        },
        "width": {
            "type": String,
            "default": "90%",
        },
        "height": {
            "type": String,
            "default": "90%",
        },
        "layout": {
            "type": String,
            "default": "center",
        },
    },

    "methods": {
        async ready ( e ) {
            this.$ext = e.detail.cmp;

            this.$refs.form.ext.setKeyMap( { "ENTER": { "handler": "submit", "scope": this } } );

            this.$ext.on( "beforeshow", this.load, this );
        },

        async load () {
            var dialog = this.$ext;

            dialog.mask( {
                "xtype": "loadmask",
                "message": `<div style="color:white;">Loading<br/>please wait...</div>`,
            } );

            var res = await this.$api.call( "admin/settings/read" );

            dialog.unmask();

            if ( !res.ok ) {
                this.$.toast( res );

                dialog.hide();
            }
            else {
                const record = Ext.create( Model, res.data );

                dialog.getViewModel().set( "record", record );
            }
        },

        async testSmtp ( e ) {
            var record = this.$ext.getViewModel().get( "record" ),
                dialog = this.$ext;

            // button = e.detail.sender;

            dialog.mask( {
                "xtype": "loadmask",
                "message": `<div style="color:white;">Testing SMTP<br/>please wait...</div>`,
            } );

            var values = {

                //
                "smtp_host": record.get( "smtp_host" ),
                "smtp_port": record.get( "smtp_port" ),
                "smtp_username": record.get( "smtp_username" ),
                "smtp_password": record.get( "smtp_password" ),
                "smtp_tls": record.get( "smtp_tls" ),
            };

            var res = await this.$api.call( "admin/settings/test-smtp", values );

            dialog.unmask();

            this.$.toast( res );
        },

        cancel () {
            this.$ext.hide();
        },

        async submit ( e ) {
            var record = this.$ext.getViewModel().get( "record" ),
                form = this.$refs.form.ext,
                dialog = this.$ext;

            if ( !form.validate() ) {
                this.$.toast( "Please, fill all required fields" );

                return;
            }

            dialog.mask( {
                "xtype": "loadmask",
                "message": `<div style="color:white;">Updating<br/>please wait...</div>`,
            } );

            var res = await this.$api.call( "admin/settings/update", record.getChanges() );

            dialog.unmask();

            if ( res.ok ) {
                record.commit();

                this.$.toast( "Settings updated" );

                this.$ext.hide();
            }
            else {
                this.$.toast( res );
            }
        },
    },
};
</script>

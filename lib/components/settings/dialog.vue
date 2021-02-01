<template>
    <ext-dialog :title="title" :width="width" :height="height" displayed="true" scrollable="true" closable="true" draggable="false" closeAction="hide" hideOnMaskTap="true" :layout="layout" viewModel="true" @ready="ready">
        <ext-fieldpanel ref="form" modelValidation="true">
            <slot name="top"/>

            <!-- SMTP -->
            <ext-fieldset title="SMTP Settings" :hidden="hideSmtpSettings" defaults='{"labelAlign":"left","labelWidth":250}'>
                <ext-textfield label="App URL" bind="{record.app_url}"/>
                <ext-textfield label="From <i class='far fa-question-circle'></i>" bind="{record.smtp_from}" placeholder="User Name <email@address>" tooltip="Format: User Name &amp;lt;email@address>."/>
                <ext-textfield label="SMTP Host" bind="{record.smtp_host}"/>
                <ext-spinnerfield label="SMTP Port" decimals="0" minValue="1" maxValue="65535" bind="{record.smtp_port}"/>
                <ext-textfield label="SMTP Username" bind="{record.smtp_username}"/>
                <ext-passwordfield label="SMTP Password" bind="{record.smtp_password}"/>
                <ext-togglefield label="SMTP TLS" bind="{record.smtp_tls}"/>
            </ext-fieldset>
            <ext-container layout='{"type":"hbox","pack":"end"}' :hidden="hideSmtpSettings">
                <ext-button text="Test SMTP" bind='{"disabled":"{!record.smtp_can_test}"}' ui="action" @tap="testSmtp"/>
            </ext-container>

            <slot name="bottom"/>
        </ext-fieldpanel>

        <ext-toolbar docked="bottom" layout='{"type":"hbox","pack":"end"}'>
            <ext-button text="Cancel" ui="decline" @tap="close"/>
            <ext-button text="Submit" ui="action" bind='{"disabled":"{!record.dirty}"}' @tap="submit"/>
        </ext-toolbar>
    </ext-dialog>
</template>

<script>
export default {
    "props": {
        "title": {
            "type": String,
            "default": "Settings",
        },
        "width": {
            "type": String,
            "default": "800",
        },
        "height": {
            "type": String,
            "default": "90%",
        },
        "layout": {
            "type": String,
            "default": "fit",
        },
        "hideSmtpSettings": {
            "type": Boolean,
            "default": false,
        },
        "noSubmitOnEnter": {
            "type": Boolean,
            "default": false,
        },
    },

    "methods": {
        async ready ( e ) {
            this.ext = e.detail.cmp;

            if ( !this.noSubmitOnEnter ) this.$refs.form.ext.setKeyMap( { "ENTER": { "handler": "submit", "scope": this } } );

            this.ext.on( "beforeshow", this.reload, this );
        },

        async reload () {
            var dialog = this.ext;

            dialog.mask( {
                "xtype": "loadmask",
                "message": `<div style="color:white;">Loading<br/>please wait...</div>`,
            } );

            var res = await this.$store.settings.reload();

            dialog.unmask();

            if ( !res.ok ) {
                this.$.toast( res );

                this.close();
            }
            else {
                dialog.getViewModel().set( "record", res.data );
            }
        },

        async testSmtp ( e ) {
            var dialog = this.ext;

            // button = e.detail.sender;

            dialog.mask( {
                "xtype": "loadmask",
                "message": `<div style="color:white;">Testing SMTP<br/>please wait...</div>`,
            } );

            var res = await this.$store.settings.testSmtp();

            dialog.unmask();

            this.$.toast( res );
        },

        close () {
            this.ext.hide();
        },

        async submit ( e ) {
            var record = this.ext.getViewModel().get( "record" ),
                form = this.$refs.form.ext,
                dialog = this.ext;

            if ( !form.validate() ) {
                this.$.toast( "Please, fill all required fields" );

                return;
            }

            dialog.mask( {
                "xtype": "loadmask",
                "message": `<div style="color:white;">Updating<br/>please wait...</div>`,
            } );

            var res = await this.$api.call( "admin/settings/update",
                record.getData( {
                    "changes": true,
                    "critical": true,
                    "serialize": true,
                } ) );

            dialog.unmask();

            if ( res.ok ) {
                record.commit();

                this.$.toast( "Settings updated" );

                this.close();
            }
            else {
                this.$.toast( res );
            }
        },
    },
};
</script>

<template>
    <ext-dialog height="400" :title="title" width="350" @ready="_ready">
        <ext-fieldpanel ref="form" @ready="formReady">
            <ext-container :html="l10n(`Enter new email address which you want to use.`, { domain: `vue-ext` })" layout="center"/>

            <ext-emailfield errorTarget="under" :label="l10n(`New email address`, { domain: `vue-ext` })" name="email" :placeholder="l10n(`Enter new email address`, { domain: `vue-ext` })" required="true" validators="email"/>

            <ext-textfield errorTarget="under" :hidden="true" :label="l10n(`Confirmation token`, { domain: `vue-ext` })" name="token" :placeholder="l10n(`Enter confirmation token`, { domain: `vue-ext` })" required="true"/>
        </ext-fieldpanel>

        <ext-container ref="tokenSentText" :hidden="true" :html="l10n(`We just sent email change confirmation token to the new email address. Please, check your inbox and enter token to the field above.`, { domain: `vue-ext` })" padding="20 0 0 0"/>

        <ext-toolbar docked="bottom" layout='{"pack":"end","type":"hbox"}'>
            <ext-button ref="sendTokenButton" :text="l10n(`Send token`, { domain: `vue-ext` })" ui="action" @tap="_sendToken"/>
            <ext-button ref="setEmailButton" :hidden="true" :text="l10n(`Change email`, { domain: `vue-ext` })" ui="action" @tap="_setEmail"/>
        </ext-toolbar>
    </ext-dialog>
</template>

<script>
import loadMask from "#src/load-mask";

export default {
    "computed": {
        title () {
            return this.l10n( `Email change` );
        },
    },

    "methods": {
        _ready ( e ) {
            this.ext = e.detail.cmp;
        },

        formReady ( e ) {
            var cmp = e.detail.cmp;

            cmp.setKeyMap( {
                "ENTER": {
                    "handler": () => {
                        if ( this.$refs.sendTokenButton.ext.isVisible() ) {
                            this._sendToken();
                        }
                        else if ( this.$refs.setEmailButton.ext.isVisible() ) {
                            this._setEmail();
                        }
                    },
                },
            } );
        },

        async _sendToken () {
            const form = this.$refs.form.ext;

            if ( !form.getFields( "email" ).validate() ) return;

            const values = form.getValues();

            this.ext.mask( loadMask );

            const res = await this.$api.call( "account/send-email-change-token", values.email );

            this.ext.unmask();

            if ( res.ok ) {
                this.$utils.toast( this.l10n( "Change email token was sent to the new email address" ) );

                form.getFields( "email" ).setReadOnly( true );
                form.getFields( "token" ).show();
                this.$refs.tokenSentText.ext.show();
                this.$refs.sendTokenButton.ext.hide();
                this.$refs.setEmailButton.ext.show();
            }
            else {
                this.$utils.toast( res );
            }
        },

        async _setEmail () {
            const form = this.$refs.form.ext;

            if ( !form.getFields( "token" ).validate() ) return;

            const values = form.getValues();

            this.ext.mask( loadMask );

            const res = await this.$api.call( "account/set-email-by-token", values.token );

            this.ext.unmask();

            if ( res.ok ) {
                this.$utils.toast( this.l10n( "Email address changed" ) );

                this.ext.close();
            }
            else {
                this.$utils.toast( res );
            }
        },
    },
};
</script>

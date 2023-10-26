<template>
    <ext-dialog height="350" :title="title" width="300" @ready="_ready">
        <ext-fieldpanel ref="form" @ready="formReady">
            <ext-container :html="l10n(`Enter new email address which you want to use.`)" layout="center"/>

            <ext-emailfield errorTarget="under" :label="l10n(`New email address`)" name="email" :placeholder="l10n(`Enter new email address`)" required="true" validators="email"/>

            <ext-textfield errorTarget="under" :hidden="true" :label="l10n(`Confirmation token`)" name="token" :placeholder="l10n(`Enter confirmation token`)" required="true"/>
        </ext-fieldpanel>

        <ext-container ref="tokenSentText" :hidden="true" :html="l10n(`We just sent email change confirmation token to the new email address. Please, check your inbox and enter token to the field above.`)" padding="20 0 0 0"/>

        <ext-toolbar docked="bottom" layout='{"pack":"end","type":"hbox"}'>
            <ext-button ref="sendTokenButton" :text="l10n(`Send token`)" ui="action" @tap="_sendToken"/>
            <ext-button ref="setEmailButton" :hidden="true" :text="l10n(`Change email`)" ui="action" @tap="_setEmail"/>
        </ext-toolbar>
    </ext-dialog>
</template>

<script>
import masks from "#src/masks";

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

            this.ext.mask( masks.loadMask );

            const res = await this.$api.call( "account/send-email-change-token", values.email );

            this.ext.unmask();

            if ( res.ok ) {
                this.$toast( this.l10n( "Change email token was sent to the new email address" ) );

                form.getFields( "email" ).setReadOnly( true );
                form.getFields( "token" ).show();
                this.$refs.tokenSentText.ext.show();
                this.$refs.sendTokenButton.ext.hide();
                this.$refs.setEmailButton.ext.show();
            }
            else {
                this.$toast( res );
            }
        },

        async _setEmail () {
            const form = this.$refs.form.ext;

            if ( !form.getFields( "token" ).validate() ) return;

            const values = form.getValues();

            this.ext.mask( masks.loadMask );

            const res = await this.$api.call( "account/set-email-by-token", values.token );

            this.ext.unmask();

            if ( res.ok ) {
                this.$toast( this.l10n( "Email address changed" ) );

                this.ext.close();
            }
            else {
                this.$toast( res );
            }
        },
    },
};
</script>

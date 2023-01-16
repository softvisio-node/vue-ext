<template>
    <ext-dialog height="400" :title="title" width="350" @ready="_ready">
        <ext-fieldpanel ref="form" @ready="formReady">
            <ext-emailfield errorTarget="under" :label="i18nd(`vue-ext`, `New email address`)" name="email" :placeholder="i18nd(`vue-ext`, `Enter new email address`)" required="true" validators="email"/>

            <ext-textfield errorTarget="under" :hidden="true" :label="i18nd(`vue-ext`, `Confirmation token`)" name="token" :placeholder="i18nd(`vue-ext`, `Enter confirmation token`)" required="true"/>
        </ext-fieldpanel>

        <ext-container ref="tokenSentText" :hidden="true" :html="i18nd(`vue-ext`, `We just sent email change confirmation token to the new email address. Please, check your inbox and enter token to the field above.`)" padding="20 0 0 0"/>

        <ext-toolbar docked="bottom" layout='{"pack":"end","type":"hbox"}'>
            <ext-button ref="sendTokenButton" :text="i18nd(`vue-ext`, `Send token`)" ui="action" @tap="_sendToken"/>
            <ext-button ref="setEmailButton" :hidden="true" :text="i18nd(`vue-ext`, `Change email`)" ui="action" @tap="_setEmail"/>
        </ext-toolbar>
    </ext-dialog>
</template>

<script>
import loadMask from "#src/load-mask";

export default {
    "computed": {
        title () {
            return this.i18nd( `vue-ext`, `Email change` );
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
                this.$utils.toast( this.i18nd( `vue-ext`, "Change email token was sent to the new email address" ) );

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
                this.$utils.toast( this.i18nd( `vue-ext`, "Email address changed" ) );

                this.ext.close();
            }
            else {
                this.$utils.toast( res );
            }
        },
    },
};
</script>

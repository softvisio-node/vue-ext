<template>
    <ext-panel layout="vbox" scrollable="true" @ready="_ready">
        <ext-toolbar docked="top">
            <ext-spacer/>
            <ext-container :html="i18nd(`vue-ext`, `Password recovery`)"/>
            <ext-spacer/>
        </ext-toolbar>

        <ext-fieldpanel ref="form">
            <ext-emailfield :errorTarget="errorTarget" :label="i18nd(`vue-ext`, `Email address`)" name="email" :placeholder="i18nd(`vue-ext`, `Enter your email address`)" required="true" validators="email"/>
        </ext-fieldpanel>

        <ext-toolbar docked="bottom">
            <ext-button iconCls="fa-solid fa-arrow-left" :text="i18nd(`vue-ext`, `Back`)" @tap="back"/>
            <ext-spacer/>
            <ext-button :text="i18nd(`vue-ext`, `Recover`)" ui="action" @tap="_submit"/>
        </ext-toolbar>
    </ext-panel>
</template>

<script>
export default {
    "emits": ["signin"],

    "errorTarget": {
        "type": String,
        "default": "qtip",
    },

    "methods": {
        _ready ( e ) {
            const cmp = e.detail.cmp;

            this.$refs.form.ext.setKeyMap( { "ENTER": { "handler": this._submit.bind( this ) } } );

            this._backListener = this.back.bind( this );

            cmp.on( "activate", () => {
                this.$app.on( "device/back-button", this._backListener );
            } );
        },

        back () {
            this.$app.off( "device/back-button", this._backListener );

            this.$emit( "signin" );

            this.$refs.form.ext.reset();
        },

        async _submit () {
            const form = this.$refs.form.ext;

            if ( !form.validate() ) {
                this.$utils.toast( this.i18nd( `vue-ext`, `Please, correctly fill all required fields` ) );

                return;
            }

            const values = form.getValues();

            Ext.Viewport.mask();

            const res = await this.$api.call( "session/send-password-recovery-email", values.email );

            Ext.Viewport.unmask();

            if ( !res.ok ) {
                this.$utils.toast( res );
            }
            else {
                form.reset();

                this.$utils.toast( this.i18nd( `vue-ext`, "Password change instructions were sent to the email address, associated with your account." ), 5000 );

                this.back();
            }
        },
    },
};
</script>

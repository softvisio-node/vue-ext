<template>
    <ext-dialog closeAction="hide" height="400" scrollable="true" :title="i18nd(`vue-ext`, `Create user`)" width="350" @ready="_ready">
        <ext-fieldpanel ref="form" defaults='{"labelAlign":"left","labelWidth":150}' @ready="formReady">
            <ext-emailfield :label="i18nd(`vue-ext`, `Email`)" name="email" required="true"/>
            <ext-passwordfield :label="i18nd(`vue-ext`, `Password`)" name="password" required="true"/>
            <ext-passwordfield :label="i18nd(`vue-ext`, `Confirm password`)" name="password1" required="true"/>
            <ext-togglefield :label="i18nd(`vue-ext`, `Access enabled`)" name="enabled" value="true"/>
        </ext-fieldpanel>

        <ext-toolbar docked="bottom">
            <ext-spacer/>
            <ext-button :text="i18nd(`vue-ext`, `Create user`)" ui="action" @tap="submit"/>
        </ext-toolbar>
    </ext-dialog>
</template>

<script>
export default {
    "emits": ["created"],

    "methods": {
        async _ready ( e ) {
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
            const form = this.$refs.form.ext;

            if ( !form.validate() ) return;

            const values = form.getValues();

            if ( values.password !== values.password1 ) {
                form.getFields( "password1" ).setError( this.i18nd( "vue-ext", "Passwords are not match" ) );

                return;
            }

            delete values.password1;

            var res = await this.$api.call( "admin/users/create", values );

            if ( res.ok ) {
                this.$utils.toast( this.i18nd( `vue-ext`, "User created" ) );

                this.$emit( "created" );

                this.close();
            }
            else {
                this.$utils.toast( res );
            }
        },
    },
};
</script>

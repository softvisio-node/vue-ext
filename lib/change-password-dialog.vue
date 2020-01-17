<template>
    <ext-component>
        <ext-dialog title="Change Password" width="300" height="300" displayed="true" closable="true" draggable="false" closeAction="destroy" @ready="ready">
            <ext-fieldpanel ref="form" defaults='{"labelAlign":"left","labelWidth":120}'>
                <ext-passwordfield name="password" label="Password" allowBlank="false" required="true"/>
                <ext-passwordfield name="password1" label="Confirm Password" allowBlank="false" required="true"/>
            </ext-fieldpanel>

            <ext-toolbar docked="bottom">
                <ext-spacer/>
                <ext-button text="Cancel" @tap="cancel"/>
                <ext-button text="Submit" @tap="submit"/>
            </ext-toolbar>
        </ext-dialog>
    </ext-component>
</template>

<script>
import Vue from "vue";

import DialogBase from "./dialog-base";

export default Vue.extend( {
    "extends": DialogBase,

    "methods": {
        cancel () {
            this.$destroy();
        },

        async submit () {
            var form = this.$refs.form.ext;

            if ( !form.validate() ) return;

            var vals = form.getValues();

            if ( vals.password !== vals.password1 ) {
                form.getFields( "password1" ).setError( "Passwords are not match" );

                return;
            }

            const res = await this.$store.dispatch( "session/changePassword", vals.password );

            if ( res.isSuccess() ) {
                Ext.toast( "Password changed." );

                this.cancel();
            }
            else {
                Ext.toast( res.toString() );
            }
        },
    },
} );
</script>

<template>
    <ext-component>
        <ext-dialog title="Change Password" width="300" height="300" displayed="true" closable="true" draggable="false" closeAction="destroy" @ready="ready">
            <ext-fieldpanel ref="form" defaults='{"labelAlign":"left","labelWidth":120}'>
                <ext-passwordfield name="password" label="Password" allowBlank="false" required="true"/>
                <ext-passwordfield ref="passwordConfirm" label="Confirm Password" allowBlank="false" required="true"/>
            </ext-fieldpanel>

            <ext-toolbar docked="bottom" layout='{"type":"hbox","pack":"end"}'>
                <ext-button text="Cancel" ui="decline" @tap="cancel"/>
                <ext-button text="Submit" ui="action" @tap="submit"/>
            </ext-toolbar>
        </ext-dialog>
    </ext-component>
</template>

<script>
import Vue from "vue";

import DialogBase from "./dialog-base";

const component = {
    "extends": DialogBase,

    "methods": {
        cancel () {
            this.$destroy();
        },

        async submit () {
            var form = this.$refs.form.ext,
                passwordCondirm = this.$refs.passwordConfirm.ext;

            if ( !form.validate() ) return;

            var vals = form.getValues();

            if ( vals.password !== passwordCondirm.getValue() ) {
                passwordCondirm.setError( "Passwords are not match" );

                return;
            }

            form.mask();

            const res = await this.$store.dispatch( "session/changePassword", vals.password );

            form.unmask();

            if ( res.isSuccess() ) {
                this.$toast( "Password changed." );

                this.cancel();
            }
            else {
                this.$toast( res );
            }
        },
    },
};

export default Vue.extend( component );
</script>

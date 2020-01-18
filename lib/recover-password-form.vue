<template>
    <ext-panel layout="center">
        <ext-formpanel ref="recoverForm" title="Recover Password" width="300" height="350" shadow="true" scrollable="true">
            <ext-textfield name="username1" label="User Name or Email" required="true" allowBlank="false"/>

            <ext-toolbar docked="bottom" layout='{"type":"hbox","align":"center"}'>
                <ext-spacer/>
                <ext-button text="Sign In" ui="plain" @tap="signin"/>
                <ext-spacer/>
                <ext-button ref="recoverButton" text="Recover Password" ui="action" @tap="submit"/>
            </ext-toolbar>
        </ext-formpanel>
    </ext-panel>
</template>

<script>
export default {
    "methods": {
        signin () {
            this.$emit( "signin" );
        },

        async submit () {
            var form = this.$refs.recoverForm.ext,
                submitButton = this.$refs.recoverButton.ext;

            if ( form.validate() ) {
                submitButton.setDisabled( true );

                var res = await this.$store.dispatch( "session/recoverPassword", form.getFields( "username1" ).getValue() );

                if ( !res.isSuccess() ) {
                    Ext.toast( res.toString() );

                    submitButton.setDisabled( false );
                }
                else {
                    Ext.toast( "Password change instructions was sent to the email address, associated with your account.", 5000 );
                }
            }
        },
    },
};
</script>

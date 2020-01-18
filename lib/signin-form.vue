<template>
    <ext-panel layout="center">
        <ext-formpanel ref="signinForm" title="Sign In" width="300" height="350" shadow="true" scrollable="true">
            <ext-textfield name="username" label="User Name or Email" required="true" allowBlank="false"/>
            <ext-passwordfield name="password" label="Password" required="true"/>

            <ext-toolbar docked="bottom" layout='{"type":"hbox","align":"center"}'>
                <ext-spacer/>
                <ext-button text="Forgot password?" ui="plain" @tap="forgotPassword"/>
                <ext-spacer/>
                <ext-button ref="signinButton" text="Sign in" ui="action" @tap="submit"/>
            </ext-toolbar>
        </ext-formpanel>
    </ext-panel>
</template>

<script>
export default {
    "methods": {
        forgotPassword () {
            this.$emit( "forgotPassword" );
        },

        async submit () {
            var form = this.$refs.signinForm.ext,
                submitButton = this.$refs.signinButton.ext;

            if ( form.validate() ) {
                submitButton.setDisabled( true );

                var res = await this.$store.dispatch( "session/signin", {
                    "username": form.getFields( "username" ).getValue(),
                    "password": form.getFields( "password" ).getValue(),
                } );

                if ( !res.isSuccess() ) {
                    Ext.toast( res.toString() );

                    submitButton.setDisabled( false );
                }
            }
        },
    },
};
</script>

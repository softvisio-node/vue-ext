<template>
    <ext-togglefield :hidden="hidden" :label="label" :labelAlign="labelAlign" :labelTextAlign="labelTextAlign" :labelWidth="labelWidth" :value="value" @change="_toggle"/>
</template>

<script>
export default {
    "props": {
        "hideLabel": {
            "type": Boolean,
            "default": false,
        },
        "labelAlign": {
            "type": String,
            "default": "left",
        },
        "labelTextAlign": {
            "type": String,
            "default": "left",
        },
        "labelWidth": {
            "type": String,
            "default": null,
        },
    },

    "computed": {
        hidden () {
            return !this.$store.session.pushNotificationsSupported;
        },

        label () {
            if ( this.hideLabel ) {
                return "";
            }
            else {
                return this.i18nd( `vue-ext`, `Receive push notifications` );
            }
        },

        value () {
            return this.$store.session.pushNotificationsEnabled ? "true" : "";
        },
    },

    "methods": {
        async _toggle ( e ) {
            const button = e.detail.sender,
                value = e.detail.newValue;

            if ( value === this.$store.session.pushNotificationsEnabled ) return;

            button.disable();

            var res;

            if ( value ) {
                res = await this.$store.session.enablePushNotifications();
            }
            else {
                res = await this.$store.session.disablePushNotifications();
            }

            if ( !res.ok ) {
                await this.$utils.sleep( 500 );

                button.setValue( !value );

                this.$utils.toast( res );
            }
            else {
                if ( value ) {
                    this.$utils.toast( this.i18nd( "vue-ext", "Push notifications enabled" ) );
                }
                else {
                    this.$utils.toast( this.i18nd( "vue-ext", "Push notifications disabled" ) );
                }
            }

            button.enable();
        },
    },
};
</script>

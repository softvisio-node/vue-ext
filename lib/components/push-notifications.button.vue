<template>
    <ext-togglefield :hidden="hidden" :label="i18nd(`vue-ext`, `Enable push notifications`)" :labelAlign="labelAlign" :labelTextAlign="labelTextAlign" :labelWidth="labelWidth" :value="value" @change="_toggle"/>
</template>

<script>
export default {
    "props": {
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

            button.enable();

            if ( !res.ok ) {
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
        },
    },
};
</script>

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
            return !this.$app.notifications.pushNotificationsSupported;
        },

        label () {
            if ( this.hideLabel ) {
                return "";
            }
            else {
                return this.l10n( `Receive push notifications` );
            }
        },

        value () {
            return this.$app.notifications.pushNotificationsEnabled ? "true" : "";
        },
    },

    "methods": {
        async _toggle ( e ) {
            const button = e.detail.sender,
                value = e.detail.newValue;

            if ( value === this.$app.notifications.pushNotificationsEnabled ) return;

            button.disable();

            var res;

            if ( value ) {
                res = await this.$app.notifications.enablePushNotifications();
            }
            else {
                res = await this.$app.notifications.disablePushNotifications();
            }

            if ( !res.ok ) {
                await this.$utils.sleep( 500 );

                button.setValue( !value );

                this.$toast( res );
            }
            else {
                if ( value ) {
                    this.$toast( this.l10n( "Push notifications enabled" ) );
                }
                else {
                    this.$toast( this.l10n( "Push notifications disabled" ) );
                }
            }

            button.enable();
        },
    },
};
</script>

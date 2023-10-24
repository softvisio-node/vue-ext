<template>
    <ext-togglefield ref="button" :disabled="disabled" :hidden="hidden" :label="label" :labelAlign="labelAlign" :labelTextAlign="labelTextAlign" :labelWidth="labelWidth" @change="_onChange" @ready="_ready"/>
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

        disabled () {
            return this.$app.notifications.pushNotificationsUpdating;
        },

        value () {
            return this.$app.notifications.pushNotificationsEnabled;
        },
    },

    "watch": {
        value ( value ) {
            this.$refs.button.ext.setValue( value );
        },
    },

    "methods": {
        _ready () {
            this.$refs.button.ext.setValue( this.value );
        },

        async _onChange ( e ) {
            const value = e.detail.newValue;

            if ( value === this.$app.notifications.pushNotificationsEnabled ) return;

            var res;

            if ( value ) {
                res = await this.$app.notifications.enablePushNotifications();
            }
            else {
                res = await this.$app.notifications.disablePushNotifications();
            }

            if ( !res.ok ) {

                // await this.$utils.sleep( 500 );

                // button.setValue( !value );

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
        },
    },
};
</script>

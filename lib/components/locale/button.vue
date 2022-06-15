<template>
    <ext-button ref="button" iconCls="fa-solid fa-language" :textAlign="textAlign" stretchMenu="true" @ready="_ready"/>
</template>

<script>
export default {
    "props": {
        "autoHide": {
            "type": Boolean,
            "default": true,
        },
        "textAlign": {
            "type": String,
            "default": "left",
        },
    },

    "methods": {
        _ready ( e ) {
            const cmp = e.detail.cmp,
                locale = this.$store.locale;

            if ( !locale.hasLocales && this.autoHide ) {
                cmp.setHidden( true );

                return;
            }

            const menu = [];

            for ( const [locale, text] of Object.entries( locale.locales ) ) {
                menu.push( {
                    text,
                    "handler": () => this._setLocale( locale ),
                } );
            }

            cmp.setMenu( menu );

            cmp.setText( locale.text );
        },

        _setLocale ( localeName ) {
            this.$store.locale.setLocale( localeName );
        },
    },
};
</script>

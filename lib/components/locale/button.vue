<template>
    <ext-button ref="button" iconCls="fa-solid fa-language" :textAlign="textAlign" stretchMenu="true" @ready="_ready"/>
</template>

<script>
import locale from "#vue/locale";

export default {
    "props": {
        "compact": {
            "type": Boolean,
            "default": false,
        },
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
            const cmp = e.detail.cmp;

            if ( !locale.hasLocales && this.autoHide ) {
                cmp.setHidden( true );

                return;
            }

            const menu = [];

            for ( const [localeId, text] of Object.entries( locale.locales ) ) {
                menu.push( {
                    "xtype": "menuradioitem",
                    text,
                    "value": localeId,
                    "group": "value",
                    "checked": localeId === locale.id,
                    "handler": () => this._setLocale( localeId ),
                } );
            }

            cmp.setMenu( menu );

            if ( this.compact ) {
                let name = locale.language;

                if ( locale.regionNameShort ) name += ` (${locale.regionNameShort})`;

                cmp.setText( name );
            }
            else {
                cmp.setText( locale.name );
            }
        },

        _setLocale ( localeId ) {
            locale.setLocale( localeId );
        },
    },
};
</script>

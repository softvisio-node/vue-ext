<template>
    <ext-button ref="button" iconCls="fa-solid fa-language" :textAlign="textAlign" stretchMenu="true" :menuAlign="menuAlign" @ready="_ready"/>
</template>

<script>
import locale from "#vue/locale";

export default {
    "props": {
        "absolute": {
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
        "menuAlign": {
            "type": String,
            "default": "tl-bl?",
        },
    },

    "methods": {
        _ready ( e ) {
            const cmp = e.detail.cmp;

            if ( this.absolute ) {
                cmp.setFloated( true );
                cmp.setStyle( "position: absolute; top: 20px; right: 20px;" );
            }

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

            cmp.setText( locale.name );
        },

        _setLocale ( localeId ) {
            locale.setLocale( localeId );
        },
    },
};
</script>

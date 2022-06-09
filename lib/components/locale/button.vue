<template>
    <ext-button ref="button" iconCls="fa-solid fa-language" :textAlign="textAlign" stretchMenu="true" @ready="_ready"/>
</template>

<script>
import locale from "#vue/locale";

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
            const cmp = e.detail.cmp;

            if ( !locale.hasLocales && this.autoHide ) {
                cmp.setHidden( true );

                return;
            }

            const menu = [];

            for ( const _locale of Object.values( locale.locales ) ) {
                menu.push( {
                    "text": _locale.name,
                    "handler": () => this._setLocale( _locale.id ),
                } );
            }

            cmp.setMenu( menu );

            cmp.setText( locale.name );
        },

        _setLocale ( id ) {
            locale.setLocale( id );
        },
    },
};
</script>

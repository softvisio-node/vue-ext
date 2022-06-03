<template>
    <ext-button ref="button" iconCls="fa-solid fa-language" stretchMenu="true" @ready="_ready"/>
</template>

<script>
import locale from "#vue/locale";

export default {
    "methods": {
        _ready ( e ) {
            const cmp = e.detail.cmp;

            const menu = [];

            for ( const _locale of Object.values( locale.locales ) ) {
                menu.push( {
                    "text": _locale.name,
                    "handler": () => this._setLanguage( _locale.id ),
                } );
            }

            cmp.setMenu( menu );

            cmp.setText( locale.locale.name );
        },

        _setLanguage ( language ) {
            locale.setLanguage( language );
        },
    },
};
</script>

<template>
    <ext-button ref="button" iconCls="fa-solid fa-language" :menuAlign="menuAlign" stretchMenu="true" :textAlign="textAlign" @ready="_ready"/>
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
                    "value": localeId,
                    text,
                    "group": "locale",
                    "checked": localeId === locale.id,
                    "handler": this._setLocale.bind( this ),
                } );
            }

            cmp.setMenu( menu );

            cmp.setText( locale.name );
        },

        async _setLocale ( menuItem ) {
            const localeId = menuItem.getValue(),
                menu = this.$refs.button.ext.getMenu();

            menu.mask();

            const res = await this.$app.setLocale( localeId );

            menu.unmask();

            if ( !res.ok ) {
                this.$utils.toast( res );

                // revert locale
                menu.getItems().each( item => {
                    item.setChecked( item.getValue() === locale.id );
                } );
            }
        },
    },
};
</script>

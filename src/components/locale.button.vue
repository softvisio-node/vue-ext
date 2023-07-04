<template>
    <ext-button ref="button" iconCls="fa-solid fa-language" :menuAlign="menuAlign" stretchMenu="true" :textAlign="textAlign" @ready="_ready"/>
</template>

<script>
export default {
    "props": {
        "absolute": {
            "type": Boolean,
            "default": false,
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

            if ( !this.$app.locale.hasLocales ) {
                cmp.setHidden( true );

                return;
            }

            const menu = [];

            for ( const locale of this.$app.locale.locales ) {
                menu.push( {
                    "xtype": "menuradioitem",
                    "value": locale.id,
                    "text": locale.languageName,
                    "group": "locale",
                    "checked": locale.id === this.$app.locale.id,
                    "handler": this._setLocale.bind( this ),
                } );
            }

            cmp.setMenu( menu );

            cmp.setText( this.$app.locale.name );
        },

        async _setLocale ( menuItem ) {
            const locale = menuItem.getValue(),
                menu = this.$refs.button.ext.getMenu();

            menu.mask();

            const res = await this.$app.locale.setLocale( locale );

            menu.unmask();

            if ( !res.ok ) {
                this.$utils.toast( res );

                // revert locale
                menu.getItems().each( item => {
                    item.setChecked( item.getValue() === this.$app.locale.id );
                } );
            }
        },
    },
};
</script>

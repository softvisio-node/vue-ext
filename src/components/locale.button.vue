<template>
    <ext-button ref="button" iconCls="fa-solid fa-language" :menuAlign="menuAlign" padding="0 0 0 1" stretchMenu="true" :textAlign="textAlign" @ready="_ready"/>
</template>

<script>
export default {
    "props": {
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

            if ( !this.$app.locale.canChangeLocale ) {
                cmp.setHidden( true );

                return;
            }

            const menu = [];

            for ( const locale of this.$app.locale.locales ) {
                menu.push( {
                    "xtype": "menuradioitem",
                    "value": locale.id,
                    "text": locale.displayName,
                    "group": "locale",
                    "checked": locale.id === this.$app.locale.id,
                    "handler": this._setLocale.bind( this ),
                } );
            }

            cmp.setMenu( menu );

            cmp.setText( this.$app.locale.locales.get( this.$app.locale.id )?.displayName || this.$app.locale.name );
        },

        async _setLocale ( menuItem ) {
            const locale = menuItem.getValue(),
                menu = this.$refs.button.ext.getMenu();

            menu.mask( {
                "xtype": "mask",
                "transparent": true,
            } );

            const res = await this.$app.locale.setLocale( locale );

            menu.unmask();

            if ( !res.ok ) {
                this.$toast( res );

                // revert locale
                menu.getItems().each( item => {
                    item.setChecked( item.getValue() === this.$app.locale.id );
                } );
            }
        },
    },
};
</script>

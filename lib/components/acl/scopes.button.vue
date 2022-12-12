<template>
    <ext-button ref="button" :text="i18nd(`vue-ext`, `Scopes`)" width="160" @ready="_ready"/>
</template>

<script>
export default {
    "props": {
        "aclId": {
            "type": String,
            "required": true,
        },
    },

    "emits": ["ready", "change"],

    "watch": {
        aclId ( newValue, oldValue ) {
            if ( newValue === oldValue ) {
                this.clear();
            }
            else {
                this._loadScopes();
            }
        },
    },

    "methods": {
        clear () {
            if ( !this.isReady ) return;

            const button = this.$refs.button.ext,
                items = button.getMenu().getItems();

            var changed;

            items.each( item => {
                if ( item.xtype !== "menucheckitem" ) return;

                if ( item.getChecked() ) {
                    item.setChecked( false );

                    changed = true;
                }
            } );

            if ( changed ) this._onChange();
        },

        async _ready ( e ) {
            this.isReady = true;

            this._loadScopes();

            this.$emit( "ready" );
        },

        async _loadScopes () {
            if ( !this.isReady ) return;

            if ( !this.aclId ) return;

            const button = this.$refs.button.ext;

            const res = await this.$api.call( "acl/get-acl-scopes", -1 );

            const menu = [];

            if ( !res.ok ) {
                menu.push( {
                    "xtype": "menuitem",
                    "separator": true,
                    "iconCls": "fa-solid fa-redo",
                    "text": this.i18nd( "vue-ext", "Refresh" ),
                    "handler": this._loadScopes.bind( this ),
                } );
            }
            else if ( res.data ) {
                for ( const scope of res.data ) {
                    menu.push( {
                        "xtype": "menucheckitem",
                        "id": scope.id,
                        "text": scope.name,
                        "listeners": {
                            "checkchange": this._onChange.bind( this ),
                        },
                    } );
                }

                menu.push(
                    { "xtype": "menuseparator" },
                    {
                        "xtype": "menuitem",
                        "separator": true,
                        "iconCls": "fa-solid fa-xmark",
                        "text": this.i18nd( "vue-ext", "Clear filter" ),
                        "handler": this.clear.bind( this ),
                    }
                );
            }

            button.setMenu( menu );
        },

        _onChange () {
            const button = this.$refs.button.ext,
                items = button.getMenu().getItems(),
                checkedItems = [];

            items.each( item => {
                if ( item.xtype !== "menucheckitem" ) return;

                if ( item.getChecked() ) checkedItems.push( item.getId() );
            } );

            if ( checkedItems.length ) {
                button.setText( this.i18nd( "vue-ext", msgid`${checkedItems.length} scppe`, msgid`${checkedItems.length} scopes`, checkedItems.length ) );

                this.$emit( "change", checkedItems );
            }
            else {
                button.setText( this.i18nd( "vue-ext", "Scopes" ) );

                this.$emit( "change" );
            }
        },
    },
};
</script>

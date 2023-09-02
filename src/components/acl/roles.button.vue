<template>
    <ext-button ref="button" :text="l10nd(`vue-ext`, `Roles filter`)" width="180" @ready="_ready"/>
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
                this.clear( true );
            }
            else {
                this._loadRoles();
            }
        },
    },

    "methods": {

        // public
        clear ( silent ) {
            if ( !this.isReady ) return;

            const button = this.$refs.button.ext,
                items = button.getMenu().getItems();

            var changed;

            items.each( item => {
                if ( item.xtype !== "menucheckitem" ) return;

                if ( item.getChecked() ) {
                    item.setChecked( false, true );

                    changed = true;
                }
            } );

            if ( !silent && changed ) this._onChange();
        },

        // protected
        async _ready ( e ) {
            this.isReady = true;

            this._loadRoles();

            this.$emit( "ready" );
        },

        async _loadRoles () {
            if ( !this.isReady ) return;

            const res = await this.$api.call( "acl/get-acl-roles", this.aclId );

            const menu = [];

            if ( !res.ok ) {
                menu.push( {
                    "xtype": "menuitem",
                    "separator": true,
                    "iconCls": "fa-solid fa-redo",
                    "text": this.l10nd( "vue-ext", "Refresh" ),
                    "handler": this._loadRoles.bind( this ),
                } );
            }
            else if ( res.data ) {
                for ( const role of res.data ) {
                    menu.push( {
                        "xtype": "menucheckitem",
                        "value": role.id,
                        "text": role.name,
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
                        "text": this.l10nd( "vue-ext", "Clear filter" ),
                        "handler": this.clear.bind( this, false ),
                    }
                );
            }

            this.$refs.button.ext.setMenu( menu );
        },

        _onChange () {
            const button = this.$refs.button.ext,
                items = button.getMenu().getItems(),
                checkedItems = [];

            items.each( item => {
                if ( item.xtype !== "menucheckitem" ) return;

                if ( item.getChecked() ) checkedItems.push( item.getValue() );
            } );

            if ( checkedItems.length ) {
                button.setText( this.l10nd( "vue-ext", msgid`${checkedItems.length} role selected`, msgid`${checkedItems.length} roles selected`, checkedItems.length ) );

                this.$emit( "change", checkedItems );
            }
            else {
                button.setText( this.l10nd( "vue-ext", "Roles filter" ) );

                this.$emit( "change" );
            }
        },
    },
};
</script>

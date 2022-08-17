<template>
    <ext-dialog closeAction="hide" height="500" layout="vbox" :title="i18nd(`vue-ext`, `User roles`)" viewModel="true" width="650" @ready="_ready">
        <ext-comboboxfield ref="addUserCombo" bind='{"hidden":"{!record.phantom}"}' displayField="name" forceSelection="true" :label="i18nd(`vue-ext`, `Select user`)" labelAlign="left" labelWidth="150" minChars="1" primaryFilter='{"operator":"like","property":"name"}' triggerAction="query" valueField="id" @ready="_addUserComboReady"/>

        <ext-togglefield ref="enabledField" bind='{"hidden":"{!record.phantom}"}' :label="i18nd(`vue-ext`, `Access enabled`)" labelAlign="left" labelWidth="150" value="true"/>

        <ext-displayfield bind='{"hidden":"{record.phantom}","value":"{record.username}"}' :label="i18nd(`vue-ext`, `Username`)" labelAlign="left" labelWidth="150"/>

        <ext-grid ref="grid" columnMenu="false" columnResize="false" flex="1" itemConfig='{"viewModel":true}' multicolumnSort="true">
            <ext-column cell='{"encodeHtml":false}' dataIndex="role_html" flex="1" sorter='{"property":"name"}' :text="i18nd(`vue-ext`, `Role`)"/>

            <ext-column align="center" sorter='{"property":"enabled"}' :text="i18nd(`vue-ext`, `Role enabled`)" width="160" @ready="_enabledColReady"/>
        </ext-grid>

        <ext-toolbar docked="bottom">
            <ext-spacer/>
            <ext-button bind='{"hidden":"{!record.phantom}"}' :text="i18nd(`vue-ext`, `Add user`)" ui="action" @tap="_addUser"/>
        </ext-toolbar>
    </ext-dialog>
</template>

<script>
import RoleModel from "./models/role";

export default {
    "emits": ["reload"],

    created () {
        this.store = Ext.create( "Ext.data.Store", {
            "model": RoleModel,
            "remoteFilter": false,
            "remoteSort": false,
        } );

        this.suggestUsersStore = Ext.create( "Ext.data.Store", {
            "autoLoad": false,
            "pageSize": null,
            "proxy": {
                "api": { "read": "acl/suggest-users" },
            },
        } );
    },

    "methods": {
        setRecord ( record, aclId ) {
            this.record = record;
            this.aclId = aclId;

            this.ext.getViewModel().set( "record", record );

            this.store.loadRawData( JSON.parse( JSON.stringify( record.get( "roles" ) ) ) );

            this.suggestUsersStore.addFilter( {
                "property": "acl_id",
                "operator": "=",
                "value": aclId,
            } );

            this.$refs.addUserCombo.ext.clearValue();
            this.$refs.enabledField.ext.setValue( true );
        },

        _ready ( e ) {
            this.$refs.grid.ext.setStore( this.store );
        },

        _enabledColReady ( e ) {
            const cmp = e.detail.cmp;

            cmp.setCell( {
                "xtype": "widgetcell",
                "widget": {
                    "xtype": "container",
                    "layout": { "type": "hbox", "pack": "center", "align": "top" },
                    "items": [
                        {
                            "xtype": "togglefield",
                            "bind": {
                                "value": "{record.enabled}",
                                "disabled": "{record.readonly}",
                            },
                            "listeners": { "change": this._setEnabled.bind( this ) },
                        },
                    ],
                },
            } );
        },

        _addUserComboReady ( e ) {
            const cmp = e.detail.cmp;

            cmp.setStore( this.suggestUsersStore );
        },

        async _setEnabled ( button, enabled ) {
            const user = this.record;

            if ( user.phantom ) return;

            const record = button.lookupViewModel().get( "record" );

            if ( enabled === record.get( "enabled" ) ) return;

            button.disable();

            const res = await this.$api.call( "acl/set-role-enabled", this.aclId, user.id, record.id, enabled );

            if ( !res.ok ) {
                await this.$utils.sleep( 500 );

                record.set( "enabled", !enabled );

                this.$utils.toast( res );
            }
            else {
                record.commit();

                this.$utils.toast( enabled ? this.i18nd( `vue-ext`, `Role enabled` ) : this.i18nd( `vue-ext`, `Role disabled` ) );

                user.set( { "roles": JSON.parse( JSON.stringify( Ext.pluck( this.store.data.items, "data" ) ) ) } );
                user.commit();
            }

            button.enable();
        },

        async _addUser () {
            const userId = this.$refs.addUserCombo.ext.getValue(),
                enabled = this.$refs.enabledField.ext.getValue();

            if ( !userId ) {
                this.$utils.toast( this.i18nd( `vue-ext`, `Please, fill all required fields` ) );

                return;
            }

            const roles = [];

            this.store.each( role => {
                if ( role.get( "enabled" ) ) roles.push( role.id );
            } );

            this.ext.mask();

            const res = await this.$api.call( "acl/add-user", this.aclId, userId, { enabled, roles } );

            this.ext.unmask();

            if ( !res.ok ) {
                this.$utils.toast( res );
            }
            else {
                this.$utils.toast( this.i18nd( `vue-ext`, `Users added` ) );

                this.$emit( "reload" );

                this.ext.hide();
            }
        },
    },
};
</script>

<template>
    <ext-dialog closeAction="hide" height="500" layout="vbox" :title="i18nd(`vue-ext`, `User roles`)" viewModel="true" width="700" @ready="_ready">
        <ext-comboboxfield ref="addUserCombo" bind='{"hidden":"{!record.phantom}"}' displayField="name" forceSelection="true" :label="i18nd(`vue-ext`, `Select user`)" labelAlign="left" labelWidth="150" minChars="1" primaryFilter='{"operator":"like","property":"name"}' triggerAction="query" valueField="id" @ready="_addUserComboReady"/>

        <ext-togglefield ref="enabledField" bind='{"hidden":"{!record.phantom}"}' :label="i18nd(`vue-ext`, `Access enabled`)" value="true"/>

        <ext-displayfield bind='{"hidden":"{record.phantom}","value":"{record.username}"}' :label="i18nd(`vue-ext`, `Username`)" labelAlign="left" labelWidth="150"/>

        <ext-grid ref="grid" columnMenu="false" columnResize="false" flex="1" itemConfig='{"viewModel":true}' multicolumnSort="true">
            <ext-column dataIndex="name" qidth="150" :text="i18nd(`vue-ext`, `Role`)"/>

            <ext-column dataIndex="description" flex="1" :text="i18nd(`vue-ext`, `Description`)"/>

            <ext-column align="center" sorter='{"property":"enabled"}' :text="i18nd(`vue-ext`, `Role enabled`)" width="200" @ready="_enabledColReady"/>
        </ext-grid>

        <ext-toolbar docked="bottom">
            <ext-spacer/>
            <ext-button bind='{"hidden":"{!record.phantom}"}' :text="i18nd(`vue-ext`, `Add user`)" ui="action" @tap="_addUser"/>
        </ext-toolbar>
    </ext-dialog>
</template>

<script>
import ObjectRoleModel from "#lib/models/object-role";

export default {
    "emits": ["reload"],

    "methods": {
        setRecord ( record, objectId ) {
            this.record = record;
            this.objectId = objectId;

            this.ext.getViewModel().set( "record", record );

            this.store.loadRawData( JSON.parse( JSON.stringify( record.get( "roles" ) ) ) );

            this.suggestUsersStore.addFilter( {
                "property": "object_id",
                "operator": "=",
                "value": objectId,
            } );

            this.$refs.addUserCombo.ext.clearValue();
            this.$refs.enabledField.ext.clearValue();
        },

        _ready ( e ) {
            this.store = Ext.create( "Ext.data.Store", {
                "model": ObjectRoleModel,
                "remoteFilter": false,
                "remoteSort": false,
            } );

            this.$refs.grid.ext.setStore( this.store );

            this.suggestUsersStore = Ext.create( "Ext.data.Store", {
                "autoLoad": false,
                "pageSize": null,
                "proxy": {

                    // "type": "softvisio",
                    "api": { "read": "object-user/suggest-users" },
                },
            } );
        },

        _enabledColReady ( e ) {
            const cmp = e.detail.cmp;

            cmp.setCell( {
                "xtype": "widgetcell",
                "widget": {
                    "xtype": "container",
                    "layout": { "type": "hbox", "pack": "center" },
                    "items": [
                        {
                            "xtype": "togglefield",
                            "bind": {
                                "value": "{record.enabled}",
                                "disabled": "{record.readOnly}",
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

        async _setEnabled ( button, newVal, oldVal ) {
            const user = this.record;

            if ( user.phantom ) return;

            const record = button.lookupViewModel().get( "record" );

            if ( newVal === record.get( "enabled" ) ) return;

            button.disable();

            var res;

            if ( newVal ) {
                res = await this.$api.call( "object-user/add-role", this.objectId, user.id, record.id );
            }
            else {
                res = await this.$api.call( "object-user/delete-role", this.objectId, user.id, record.id );
            }

            button.enable();

            if ( !res.ok ) {
                record.reject();

                this.$utils.toast( res );
            }
            else {
                record.commit();

                user.set( { "roles": JSON.parse( JSON.stringify( Ext.pluck( this.store.data.items, "data" ) ) ) } );
                user.commit();
            }
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

            const res = await this.$api.call( "object-user/add", this.objectId, userId, { enabled, roles } );

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

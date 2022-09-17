<template>
    <ext-tabpanel defaults='{"padding":"0 10 0 10"}' layout='{"animation":{"direction":"vertical","type":"slide"}}' tabBar='{"defaults":{"flex":null,"height":50,"padding":"0 10 0 10","textAlign":"right","width":170},"layout":{"align":"start","pack":"start","type":"vbox"}}' tabBarPosition="left" tabRotation="none">
        <slot name="top"/>

        <!-- security -->
        <ext-panel layout="vbox" :title="i18nd(`vue-ext`, `Security`)" viewModel="true">
            <!-- primary email -->
            <ext-container ref="usernameContainer" defaults='{"labelAlign":"left","labelWidth":200}' layout="hbox">
                <ext-displayfield :label="i18nd(`vue-ext`, `Primary email address`)" value="dzagashev@gmail.com"/>
                <ext-button :text="i18nd(`vue-ext`, `Change`)" @tap="_editUsername"/>
            </ext-container>

            <ext-container ref="editUsernameContainer" defaults='{"labelAlign":"left","labelWidth":200}' :hidden="true" layout="hbox">
                <ext-emailfield ref="usernameField" :label="i18nd(`vue-ext`, `Primary email address`)" value="dzagashev@gmail.com"/>
                <ext-button iconCls="fa-solid fa-xmark" :text="i18nd(`vue-ext`, `Cancel`)" @tap="_cancelEditUsername"/>
                <ext-button iconCls="fa-solid fa-check" :text="i18nd(`vue-ext`, `Save`)" @tap="_setUsername"/>
            </ext-container>

            <!-- password -->
            <ext-panel>
                <ext-toolbar docked="top">
                    <ext-container :html="i18nd(`vue-ext`, `Password change`)"/>
                </ext-toolbar>

                <ext-fieldpanel ref="changePasswordForm" defaults='{"labelAlign":"left","labelWidth":200}'>
                    <ext-passwordfield :label="i18nd(`vue-ext`, `New password`)" name="password" required="true"/>
                    <ext-passwordfield ref="passwordConfirm" :label="i18nd(`vue-ext`, `Confirm new password`)" required="true"/>
                </ext-fieldpanel>

                <ext-container layout='{"pack":"end","type":"hbox"}'>
                    <ext-button :text="i18nd(`vue-ext`, `Change password`)" @tap="changePassword"/>
                </ext-container>
            </ext-panel>

            <!-- active sessions -->
            <UserSessionsPanel flex="1"/>
        </ext-panel>

        <!-- notifications -->
        <ext-panel layout="fit" :title="i18nd(`vue-ext`, `Notifications`)">
            <NotificationsPanel/>
        </ext-panel>

        <!-- tokens -->
        <ext-panel layout="fit" :title="i18nd(`vue-ext`, `Access tokens`)">
            <UserTokensPanel/>
        </ext-panel>

        <!-- theme -->
        <ext-panel layout="vbox" :title="i18nd(`vue-ext`, `Interface theme`)" viewModel="true">
            <ext-toolbar docked="top">
                <ext-container :html="i18nd(`vue-ext`, `Interface theme`)"/>
            </ext-toolbar>

            <ext-fieldset defaults='{"labelAlign":"left","labelWidth":200}'>
                <ext-togglefield :label="i18nd(`vue-ext`, `Use OS theme`)" :value="systemDarkMode" @change="systemDarkMode = $event"/>

                <DarkModeButton :disabled="systemDarkMode"/>

                <ext-fieldcontainer :label="i18nd(`vue-ext`, `Base color`)" layout="fit">
                    <ext-dataview inline="true" @childtap="themeBaseChanged" @ready="themesColorsViewReady"/>
                </ext-fieldcontainer>

                <ext-fieldcontainer :label="i18nd(`vue-ext`, `Accent color`)" layout="fit">
                    <ext-componentdataview inline="true" @childtap="themeAccentChanged" @ready="themesColorsViewReady"/>
                </ext-fieldcontainer>
            </ext-fieldset>
        </ext-panel>

        <slot name="bottom"/>
    </ext-tabpanel>
</template>

<script>
import UserSessionsPanel from "#lib/components/user-sessions/panel";
import NotificationsPanel from "#lib/components/notifications/panel";
import UserTokensPanel from "#lib/components/user-tokens/panel";
import DarkModeButton from "#lib/components/dark-mode.button";

export default {
    "components": { UserSessionsPanel, NotificationsPanel, UserTokensPanel, DarkModeButton },

    "computed": {
        "systemDarkMode": {
            get () {
                return this.$store.theme.systemDarkMode;
            },

            set ( e ) {
                this.$store.theme.setSystemDarkMode( e.detail.newValue );
            },
        },
    },

    "methods": {
        _ready () {
            this.reload();
        },

        _editUsername () {
            this.$refs.usernameContainer.ext.hide();

            this.$refs.editUsernameContainer.ext.show();
        },

        _cancelEditUsername () {
            this.$refs.usernameContainer.ext.show();

            this.$refs.editUsernameContainer.ext.hide();
        },

        async _setUsername () {
            const username = this.$refs.usernameField.ext.getValue();

            this.$refs.editUsernameContainer.ext.mask();

            const res = await this.$api.call( "account/set-email", username );

            this.$refs.editUsernameContainer.ext.unmask();

            if ( res.ok ) {
                this.$utils.toast( res );

                this._cancelEditUsername();
            }
            else {
                this.$utils.toast( res );

                this._cancelEditUsername();
            }
        },

        async reload () {
            const res = await this.$api.call( "account/get-account" );

            if ( !res.ok ) {
                this.$utils.toast( res );
            }
        },

        themesColorsViewReady ( e ) {
            const cmp = e.detail.cmp;

            cmp.setItemTpl( `
                        <div style="cursor:pointer;margin:5px 5px 5px 5px;border:1px dotted">
                            <div style="width:20px;height:20px;background-color:{color}" data-qtip="{title}"></div>
                        </div>
                    ` );

            const colors = Ext.theme.Material.getColors();

            const store = new Ext.data.Store( {
                "data": Object.keys( colors )
                    .sort()
                    .map( name => {
                        return {
                            "name": name,
                            "title": name.replaceAll( /(-.)/g, match => match.replace( "-", " " ).toUpperCase() ).replace( /^./, match => match.toUpperCase() ),
                            "color": colors[name][500],
                        };
                    } ),
            } );

            cmp.setStore( store );
        },

        themeBaseChanged ( e ) {
            const record = e.detail.location.record;

            this.$store.theme.setTheme( { "base": record.get( "name" ) } );
        },

        themeAccentChanged ( e ) {
            const record = e.detail.location.record;

            this.$store.theme.setTheme( { "accent": record.get( "name" ) } );
        },

        async changePassword () {
            var form = this.$refs.changePasswordForm.ext,
                passwordCondirm = this.$refs.passwordConfirm.ext;

            if ( !form.validate() ) return;

            var vals = form.getValues();

            if ( vals.password !== passwordCondirm.getValue() ) {
                passwordCondirm.setError( "Passwords are not match" );

                return;
            }

            Ext.Viewport.mask();

            const res = await this.$store.session.setPassword( vals.password );

            Ext.Viewport.unmask();

            if ( res.ok ) {
                form.reset( true );

                this.$utils.toast( this.i18nd( `vue-ext`, "Password changed" ) );
            }
            else {
                this.$utils.toast( res );
            }
        },
    },
};
</script>

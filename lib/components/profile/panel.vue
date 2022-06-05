<template>
    <ext-tabpanel tabBarPosition="left" tabRotation="none" tabBar='{"layout":{"type":"vbox","pack":"start","align":"start"},"defaults":{"padding":"0 10 0 10","width":170,"height":50,"flex":null,"textAlign":"right"}}' layout='{"animation":{"type":"slide","direction":"vertical"}}' padding="0 10 0 10">
        <slot name="top"/>

        <!-- security -->
        <ext-panel :title="i18n(`Security`)" layout="vbox" viewModel="true">
            <ext-panel>
                <ext-toolbar docked="top">
                    <ext-container :html="i18n(`Delete sessions`)"/>
                </ext-toolbar>

                <ext-container layout="hbox">
                    <ext-container flex="1" :html="i18n(`Sign out from all sessions, except this session`)"/>
                    <ext-button :text="i18n(`Drop sessions`)" @tap="deleteSessions"/>
                </ext-container>
            </ext-panel>

            <ext-panel>
                <ext-toolbar docked="top">
                    <ext-container :html="i18n(`Change password`)"/>
                </ext-toolbar>
                <ext-fieldpanel ref="changePasswordForm" width="50%">
                    <ext-passwordfield name="password" :label="i18n(`New password`)" required="true"/>
                    <ext-passwordfield ref="passwordConfirm" :label="i18n(`Confirm new password`)" required="true"/>

                    <ext-container layout='{"type":"hbox","pack":"end"}'>
                        <ext-button :text="i18n(`Update password`)" @tap="changePassword"/>
                    </ext-container>
                </ext-fieldpanel>
            </ext-panel>
        </ext-panel>

        <!-- notifications -->
        <ext-panel :title="i18n(`Notifications`)" layout="fit">
            <NotificationsPanel/>
        </ext-panel>

        <!-- theme -->
        <ext-panel :title="i18n(`Interface theme`)" layout="vbox" viewModel="true">
            <ext-toolbar docked="top">
                <ext-container :html="i18n(`Interface theme`)"/>
            </ext-toolbar>

            <ext-fieldset layout1='{"type":"vbox","pack":"start","align":"start"}' defaults='{"labelAlign":"left","labelWidth":150}'>
                <ext-togglefield :label="i18n(`Follow OS theme`)" :value="systemDarkMode" @change="systemDarkMode = $event"/>

                <ext-togglefield :label="darkModeLabel" :value="darkMode" :disabled="systemDarkMode" @change="darkMode = $event"/>

                <ext-fieldcontainer :label="i18n(`Base color`)" layout="fit">
                    <ext-dataview inline="true" @ready="themesColorsViewReady" @childtap="themeBaseChanged"/>
                </ext-fieldcontainer>

                <ext-fieldcontainer :label="i18n(`Accent color`)" layout="fit">
                    <ext-componentdataview inline="true" @ready="themesColorsViewReady" @childtap="themeAccentChanged"/>
                </ext-fieldcontainer>
            </ext-fieldset>
        </ext-panel>

        <slot name="bottom"/>
    </ext-tabpanel>
</template>

<script>
import NotificationsPanel from "#components/notifications/panel";

export default {
    "components": { NotificationsPanel },

    data () {
        return {
            "darkModeLabel": `<i class="fa-solid fa-adjust"></i> ${this.i18n( `Dark mode` )}`,
        };
    },

    "computed": {
        "systemDarkMode": {
            get () {
                return this.$store.theme.systemDarkMode;
            },

            set ( e ) {
                this.$store.theme.setSystemDarkMode( e.detail.newValue );
            },
        },

        "darkMode": {
            get () {
                return this.$store.theme.darkMode + "";
            },

            set ( e ) {
                this.$store.theme.setDarkMode( e.detail.newValue );
            },
        },
    },

    "methods": {
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

                this.$utils.toast( this.i18n( "Password changed" ) );
            }
            else {
                this.$utils.toast( res );
            }
        },

        async deleteSessions ( e ) {
            const button = e.detail.sender;

            button.disable();

            const res = await this.$api.call( "profile/delete-sessions" );

            button.enable();

            if ( !res.ok ) {
                this.$utils.toast( res );
            }
            else {
                this.$utils.toast( this.i18n( "Sessions were deleted" ) );
            }
        },
    },
};
</script>

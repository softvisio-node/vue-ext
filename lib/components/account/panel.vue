<template>
    <ext-tabpanel layout='{"animation":{"direction":"vertical","type":"slide"}}' padding="0 10 0 10" tabBar='{"defaults":{"flex":null,"height":50,"padding":"0 10 0 10","textAlign":"right","width":170},"layout":{"align":"start","pack":"start","type":"vbox"}}' tabBarPosition="left" tabRotation="none">
        <slot name="top"/>

        <!-- security -->
        <ext-panel layout="vbox" :title="i18nd(`vue-ext`, `Security`)" viewModel="true">
            <!-- change password -->
            <ext-panel>
                <ext-toolbar docked="top">
                    <ext-container :html="i18nd(`vue-ext`, `Password change`)"/>
                </ext-toolbar>
                <ext-fieldpanel ref="changePasswordForm">
                    <ext-passwordfield :label="i18nd(`vue-ext`, `New password`)" name="password" required="true"/>
                    <ext-passwordfield ref="passwordConfirm" :label="i18nd(`vue-ext`, `Confirm new password`)" required="true"/>

                    <ext-container layout='{"pack":"end","type":"hbox"}'>
                        <ext-button :text="i18nd(`vue-ext`, `Change password`)" @tap="changePassword"/>
                    </ext-container>
                </ext-fieldpanel>
            </ext-panel>

            <!-- drop sessions -->

            <ext-container layout="hbox">
                <ext-container flex="1" :html="i18nd(`vue-ext`, `Sign out from all sessions, except this session`)"/>
                <ext-button :text="i18nd(`vue-ext`, `Drop sessions`)" @tap="deleteSessions"/>
            </ext-container>
        </ext-panel>

        <!-- notifications -->
        <ext-panel layout="fit" :title="i18nd(`vue-ext`, `Notifications`)">
            <NotificationsPanel/>
        </ext-panel>

        <!-- theme -->
        <ext-panel layout="vbox" :title="i18nd(`vue-ext`, `Interface theme`)" viewModel="true">
            <ext-toolbar docked="top">
                <ext-container :html="i18nd(`vue-ext`, `Interface theme`)"/>
            </ext-toolbar>

            <ext-fieldset defaults='{"labelAlign":"left","labelWidth":200}' layout1='{"align":"start","pack":"start","type":"vbox"}'>
                <ext-togglefield :label="i18nd(`vue-ext`, `Use OS theme`)" :value="systemDarkMode" @change="systemDarkMode = $event"/>

                <ext-togglefield :disabled="systemDarkMode" :label="darkModeLabel" :value="darkMode" @change="darkMode = $event"/>

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
import NotificationsPanel from "#lib/components/notifications/panel";

export default {
    "components": { NotificationsPanel },

    data () {
        return {
            "darkModeLabel": `<i class="fa-solid fa-adjust"></i> ${this.i18nd( `vue-ext`, `Dark mode` )}`,
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

                this.$utils.toast( this.i18nd( `vue-ext`, "Password changed" ) );
            }
            else {
                this.$utils.toast( res );
            }
        },

        async deleteSessions ( e ) {
            const button = e.detail.sender;

            button.disable();

            const res = await this.$api.call( "account/delete-sessions" );

            button.enable();

            if ( !res.ok ) {
                this.$utils.toast( res );
            }
            else {
                this.$utils.toast( this.i18nd( `vue-ext`, "Sessions were deleted" ) );
            }
        },
    },
};
</script>

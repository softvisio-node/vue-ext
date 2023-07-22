<template>
    <ext-container>
        <!-- device dart mode -->
        <ext-container layout='{"align":"start","type":"hbox"}'>
            <ext-container layout="vbox" width="260">
                <ext-container :html="l10nd(`vue-ext`, `Device dark mode`)" style="font-size: 1.3em"/>
                <ext-container :html="l10nd(`vue-ext`, `User your device dark mode settings`)"/>
            </ext-container>
            <ext-container>
                <DeviceDarkModeButton label=""/>
            </ext-container>
        </ext-container>

        <ext-spacer height="20"/>

        <!-- dart mode -->
        <ext-container layout='{"align":"start","type":"hbox"}'>
            <ext-container layout="vbox" width="260">
                <ext-container :html="l10nd(`vue-ext`, `Dark mode`)" style="font-size: 1.3em"/>
                <ext-container :html="l10nd(`vue-ext`, `Toggle dark mode`)"/>
            </ext-container>
            <ext-container>
                <DarkModeButton :disabled="deviceDarkMode" :hideLabel="true"/>
            </ext-container>
        </ext-container>

        <ext-spacer height="20"/>

        <!-- base color -->
        <ext-container layout='{"align":"start","type":"hbox"}'>
            <ext-container layout="vbox" width="260">
                <ext-container :html="l10nd(`vue-ext`, `Base color`)" style="font-size: 1.3em"/>
                <ext-container :html="l10nd(`vue-ext`, `Interface base color`)"/>
            </ext-container>
            <ext-container flex="1">
                <ext-dataview inline="true" @childtap="themeBaseChanged" @ready="themesColorsViewReady"/>
            </ext-container>
        </ext-container>

        <ext-spacer height="20"/>

        <!-- accent color -->
        <ext-container layout='{"align":"start","type":"hbox"}'>
            <ext-container layout="vbox" width="260">
                <ext-container :html="l10nd(`vue-ext`, `Accent color`)" style="font-size: 1.3em"/>
                <ext-container :html="l10nd(`vue-ext`, `Color for badges, etc.`)"/>
            </ext-container>
            <ext-container flex="1">
                <ext-componentdataview inline="true" @childtap="themeAccentChanged" @ready="themesColorsViewReady"/>
            </ext-container>
        </ext-container>
    </ext-container>
</template>

<script>
import DarkModeButton from "#src/components/dark-mode.button";
import DeviceDarkModeButton from "#src/components/device-dark-mode.button";

export default {
    "components": { DarkModeButton, DeviceDarkModeButton },

    "computed": {
        deviceDarkMode () {
            return this.$app.theme.deviceDarkMode;
        },
    },

    "methods": {
        themesColorsViewReady ( e ) {
            const cmp = e.detail.cmp;

            cmp.setItemTpl( `
                        <div style="cursor:pointer;margin:5px 5px 5px 5px;border:1px dotted">
                            <div style="width:30px;height:40px;background-color:{color}" data-qtip="{title}"></div>
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

            this.$app.theme.theme = { "base": record.get( "name" ) };
        },

        themeAccentChanged ( e ) {
            const record = e.detail.location.record;

            this.$app.theme.theme = { "accent": record.get( "name" ) };
        },
    },
};
</script>

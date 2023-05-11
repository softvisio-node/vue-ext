<template>
    <ext-fieldset defaults='{"labelAlign":"left","labelWidth":200}'>
        <SystemDarkModeButton/>

        <DarkModeButton :disabled="systemDarkMode"/>

        <ext-fieldcontainer container='{"defaults":null}' :label="i18nd(`vue-ext`, `Base color`)" layout="fit">
            <ext-dataview inline="true" @childtap="themeBaseChanged" @ready="themesColorsViewReady"/>
        </ext-fieldcontainer>

        <ext-fieldcontainer container='{"defaults":null}' :label="i18nd(`vue-ext`, `Accent color`)" layout="fit">
            <ext-componentdataview inline="true" @childtap="themeAccentChanged" @ready="themesColorsViewReady"/>
        </ext-fieldcontainer>
    </ext-fieldset>
</template>

<script>
import DarkModeButton from "#src/components/dark-mode.button";
import SystemDarkModeButton from "#src/components/system-dark-mode.button";
import themeStore from "#vue/stores/theme";

export default {
    "components": { DarkModeButton, SystemDarkModeButton },

    "computed": {
        systemDarkMode () {
            return themeStore.systemDarkMode;
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

            themeStore.theme = { "base": record.get( "name" ) };
        },

        themeAccentChanged ( e ) {
            const record = e.detail.location.record;

            themeStore.theme = { "accent": record.get( "name" ) };
        },
    },
};
</script>

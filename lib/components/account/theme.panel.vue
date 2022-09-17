<template>
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
</template>

<script>
import DarkModeButton from "#lib/components/dark-mode.button";

export default {
    "components": { DarkModeButton },

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
    },
};
</script>

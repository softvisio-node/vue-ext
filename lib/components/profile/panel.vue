<template>
    <ext-tabpanel tabBarPosition="left" tabRotation="none" tabBar='{"layout":{"type":"vbox","pack":"start","align":"start"},"defaults":{"padding":"0 10 0 10","width":250,"height":50,"flex":null,"textAlign":"right"}}' layout='{"animation":{"type":"slide","direction":"vertical"}}' padding="0 10 0 10">
        <slot name="top"/>

        <!-- Theme -->
        <ext-panel title="Interface Theme" iconCls="fas fa-palette" iconAlign="left">
            <ext-panel scrollable="true" layout="vbox" viewModel="true">
                <ext-fieldset title='<i class="fas fa-palette"></i> Application Interface Theme' layout='{"type":"hbox","pack":"start","align":"start"}'>
                    <ext-fieldset layout="vbox" width="120">
                        <ext-togglefield label="Follow OS Theme" :value="systemDarkMode" @change="systemDarkMode = $event"/>
                        <ext-togglefield label='<i class="fas fa-adjust"></i> Dark Mode' :value="darkMode" :disabled="systemDarkMode" @change="darkMode = $event"/>
                    </ext-fieldset>

                    <ext-spacer width="20"/>

                    <ext-fieldset layout="vbox" flex="1">
                        <ext-label html="Base Color"/>
                        <ext-dataview inline="true" @ready="themesColorsViewReady" @childtap="themeBaseChanged"/>
                    </ext-fieldset>

                    <ext-fieldset layout="vbox" flex="1">
                        <ext-label html="Accent Color"/>
                        <ext-dataview inline="true" @ready="themesColorsViewReady" @childtap="themeAccentChanged"/>
                    </ext-fieldset>
                </ext-fieldset>
            </ext-panel>
        </ext-panel>

        <slot name="bottom"/>
    </ext-tabpanel>
</template>

<script>
export default {
    "computed": {
        "systemDarkMode": {
            get () {
                return this.$store.theme.systemDarkMode + "";
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
                            "title": name.replace( /(-.)/g, match => match.replace( "-", " " ).toUpperCase() ).replace( /^./, match => match.toUpperCase() ),
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

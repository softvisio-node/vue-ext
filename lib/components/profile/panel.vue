<template>
    <ext-panel scrollable="true" layout="vbox" viewModel="true">
        <ext-fieldset title='<i class="fas fa-palette"></i> Application Interface Theme' layout='{"type":"hbox","pack":"start","align":"start"}'>
            <ext-fieldset layout="vbox" width="100">
                <ext-label html='<i class="fas fa-adjust"></i> Dark Mode'/>
                <ext-togglefield :value="darkMode" @change="darkMode = $event"/>
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
</template>

<script>
export default {
    "computed": {
        "darkMode": {
            get () {
                return this.$store.state.theme.darkMode + "";
            },

            set ( e ) {
                this.$store.commit( "theme/darkMode", e.detail.newValue );
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

            this.$store.commit( "theme/theme", { "base": record.get( "name" ) } );
        },

        themeAccentChanged ( e ) {
            const record = e.detail.location.record;

            this.$store.commit( "theme/theme", { "accent": record.get( "name" ) } );
        },
    },
};
</script>

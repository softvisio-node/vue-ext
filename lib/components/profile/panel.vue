<template>
    <ext-panel scrollable="true" layout="vbox" viewModel="true">
        <!-- <ext&#45;fieldpanel ref="form" modelValidation="true" layout="vbox" defaults='{"defaults":{"labelAlign":"left","labelWidth":250}}'/> -->

        <ext-fieldset title='<i class="fas fa-palette"></i> Application Interface Theme' layout='{"type":"hbox","pack":"start","align":"start"}'>
            <ext-fieldset layout="vbox" width="100">
                <ext-label html="Dark Mode"/>
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

        <!-- <ext&#45;toolbar docked="bottom" layout='{"type":"hbox","pack":"end"}'> -->
        <!--     <ext&#45;button text="Cancel" ui="decline" @tap="cancel"/> -->
        <!--     <ext&#45;button text="Submit" ui="action" bind='{"disabled":"{!record.dirty}"}' @tap="submit"/> -->
        <!-- </ext&#45;toolbar> -->
    </ext-panel>
</template>

<script>
import Model from "@/models/settings";

export default {
    "computed": {
        "darkMode": {
            get () {
                return this.$store.state.theme.darkMode + "";
            },

            set ( e ) {
                this.$store.dispatch( "theme/setDarkMode", e.detail.newValue );
            },
        },
    },

    "methods": {
        async ready ( e ) {
            this.ext = e.detail.cmp;

            this.$refs.form.ext.setKeyMap( { "ENTER": { "handler": "submit", "scope": this } } );

            this.ext.on( "beforeshow", this.load, this );
        },

        async load () {
            var dialog = this.ext;

            dialog.mask( {
                "xtype": "loadmask",
                "message": `<div style="color:white;">Loading<br/>please wait...</div>`,
            } );

            var res = await this.$api.call( "admin/settings/read" );

            dialog.unmask();

            if ( !res.ok ) {
                this.$.toast( res );

                dialog.hide();
            }
            else {
                const record = Ext.create( Model, res.data );

                dialog.getViewModel().set( "record", record );
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
                            "title": name.replace( /(-.)/g, match => match.replace( "-", " " ).toUpperCase() ).replace( /^./, match => match.toUpperCase() ),
                            "color": colors[name][500],
                        };
                    } ),
            } );

            cmp.setStore( store );
        },

        themeBaseChanged ( e ) {
            const record = e.detail.location.record;

            this.$store.dispatch( "theme/setTheme", { "base": record.get( "name" ) } );
        },

        themeAccentChanged ( e ) {
            const record = e.detail.location.record;

            this.$store.dispatch( "theme/setTheme", { "accent": record.get( "name" ) } );
        },

        cancel () {
            this.ext.hide();
        },

        async submit ( e ) {
            var record = this.ext.getViewModel().get( "record" ),
                form = this.$refs.form.ext,
                dialog = this.ext;

            if ( !form.validate() ) {
                this.$.toast( "Please, fill all required fields" );

                return;
            }

            dialog.mask( {
                "xtype": "loadmask",
                "message": `<div style="color:white;">Updating<br/>please wait...</div>`,
            } );

            var res = await this.$api.call( "admin/settings/update", record.getChanges() );

            dialog.unmask();

            if ( res.ok ) {
                record.commit();

                this.$.toast( "Settings updated" );

                this.ext.hide();
            }
            else {
                this.$.toast( res );
            }
        },
    },
};
</script>

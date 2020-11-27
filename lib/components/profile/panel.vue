<template>
    <ext-panel scrollable="true" layout="vbox" viewModel="true">
        <!-- <ext&#45;fieldpanel ref="form" modelValidation="true" layout="vbox" defaults='{"defaults":{"labelAlign":"left","labelWidth":250}}'/> -->

        <ext-fieldpanel>
            <ext-togglefield label="Dark Mode" labelAlign="left" :value="darkMode" @change="darkMode = $event"/>
            <ext-fieldcontainer label='<i class="fas fa-palette"></i> Theme' labelAlign="left">
                <ext-dataview inline="true" @ready="themesViewReady" @childtap="themeChanged"/>
            </ext-fieldcontainer>
        </ext-fieldpanel>

        <!-- <ext&#45;toolbar docked="bottom" layout='{"type":"hbox","pack":"end"}'> -->
        <!--     <ext&#45;button text="Cancel" ui="decline" @tap="cancel"/> -->
        <!--     <ext&#45;button text="Submit" ui="action" bind='{"disabled":"{!record.dirty}"}' @tap="submit"/> -->
        <!-- </ext&#45;toolbar> -->
    </ext-panel>
</template>

<script>
import Model from "@/models/settings";
import themes from "../../../resources/material-themes.json";

export default {
    "computed": {
        "darkMode": {
            get () {
                return this.$store.getters["theme/darkMode"];
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

        themesViewReady ( e ) {
            const cmp = e.detail.cmp;

            cmp.setItemTpl( `
                    <div style="cursor:pointer;margin:5px 5px 5px 5px;border:1px dotted">
                        <div style="width:20px;height:20px;background-color:{baseColor}"></div>
                        <div style="width:20px;height:20px;background-color:{accentColor}"></div>
                    </div>
                ` );

            const store = new Ext.data.Store( {
                "data": themes.map( theme => {
                    return {
                        "accent": theme.accent,
                        "base": theme.base,
                        "accentColor": theme.accentHex || theme.accent,
                        "baseColor": theme.baseHex || theme.base,
                    };
                } ),
            } );

            cmp.setStore( store );
        },

        themeChanged ( e ) {
            const record = e.detail.location.record;

            this.$store.dispatch( "theme/setTheme", { "accent": record.get( "accent" ), "base": record.get( "base" ) } );
        },

        cancel () {
            this.ext.hide();
        },

        // XXX
        themeChanged1 ( e ) {
            const id = e.detail.newValue,
                theme = themes[id];

            this.$store.dispatch( "theme/setTheme", theme );
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

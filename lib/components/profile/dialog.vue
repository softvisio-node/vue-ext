<template>
    <ext-dialog title="User Profile" :width="width" :height="height" displayed="true" scrollable="true" closable="true" draggable="false" closeAction="hide" hideOnMaskTap="true" bodyPaddign="10" layout="fit" viewModel="true" @ready="ready">
        <ext-panel scrollable="true" layout="vbox">
            <!-- <ext&#45;fieldpanel ref="form" modelValidation="true" layout="vbox" defaults='{"defaults":{"labelAlign":"left","labelWidth":250}}'/> -->

            <ext-fieldpanel>
                <ext-togglefield label="Dark Mode" labelAlign="left" :value="darkMode" @change="darkMode = $event"/>
                <ext-combobox label='<i class="fas fa-palette"></i> Theme' labelAlign="left" editable="false" forceSelection="true" @ready="themeFieldReady" @change="themeChanged"/>
            </ext-fieldpanel>

            <slot/>
        </ext-panel>

        <!-- <ext&#45;toolbar docked="bottom" layout='{"type":"hbox","pack":"end"}'> -->
        <!--     <ext&#45;button text="Cancel" ui="decline" @tap="cancel"/> -->
        <!--     <ext&#45;button text="Submit" ui="action" bind='{"disabled":"{!record.dirty}"}' @tap="submit"/> -->
        <!-- </ext&#45;toolbar> -->
    </ext-dialog>
</template>

<script>
import Model from "@/models/settings";
import themes from "../../../resources/material-themes.json";

export default {
    "props": {
        "width": {
            "type": String,
            "default": "500",
        },
        "height": {
            "type": String,
            "default": "300",
        },
    },

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
            this.$ext = e.detail.cmp;

            this.$refs.form.ext.setKeyMap( { "ENTER": { "handler": "submit", "scope": this } } );

            this.$ext.on( "beforeshow", this.load, this );
        },

        async load () {
            var dialog = this.$ext;

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

        themeFieldReady ( e ) {
            const cmp = e.detail.cmp;

            const store = new Ext.data.Store( {
                "data": Object.keys( themes ).map( name => {
                    return {
                        "value": name,
                        "text": name,
                    };
                } ),
            } );

            cmp.setStore( store );
        },

        themeChanged ( e ) {
            const id = e.detail.newValue,
                theme = themes[id];

            this.$store.dispatch( "theme/setTheme", theme );
        },

        cancel () {
            this.$ext.hide();
        },

        async submit ( e ) {
            var record = this.$ext.getViewModel().get( "record" ),
                form = this.$refs.form.ext,
                dialog = this.$ext;

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

                this.$ext.hide();
            }
            else {
                this.$.toast( res );
            }
        },
    },
};
</script>

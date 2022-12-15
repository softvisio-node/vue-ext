<template>
    <ext-dialog closeAction="hide" height="400" layout="vbox" :title="i18nd(`vue-ext`, `About the project`)" width="350">
        <ext-fieldpanel defaults='{"labelAlign":"left"}'>
            <ext-displayfield :label="i18nd(`vue-ext`, `UI version`)" :value="'v' + frontend.currentVersion"/>
            <ext-displayfield :label="i18nd(`vue-ext`, `UI mode`)" :value="frontend.mode"/>

            <ext-displayfield :label="i18nd(`vue-ext`, `Backend version`)" :value="'v' + backend.currentVersion"/>
            <ext-displayfield :label="i18nd(`vue-ext`, `Backend mode`)" :value="backend.mode"/>
        </ext-fieldpanel>

        <ext-toolbar docked="bottom" layout='{"pack":"end","type":"hbox"}'>
            <ext-button iconCls="fa-regular fa-copy" :text="i18nd(`vue-ext`, `Copy to clipboard`)" ui="action" @tap="_copy"/>
        </ext-toolbar>
    </ext-dialog>
</template>

<script>
export default {
    "computed": {
        backend () {
            return this.$app.backendGitId || {};
        },

        frontend () {
            return this.$app.frontendGitId || {};
        },
    },

    "methods": {
        _copy () {
            this.$utils.copyToClipboard( JSON.stringify(
                {
                    "backend": this.$app.backendGitId,
                    "frontend": this.$app.frontendGitId,
                },
                null,
                4
            ) );

            this.$utils.toast( this.i18nd( "vue-ext", "Version info copied" ) );
        },
    },
};
</script>

<template>
    <ext-dialog height="400" layout="vbox" :title="l10n(`About the project`)" width="350">
        <ext-fieldpanel defaults='{"labelAlign":"left"}'>
            <ext-displayfield :label="l10n(`UI version`)" :value="'v' + frontend.currentVersion"/>
            <ext-displayfield :label="l10n(`UI mode`)" :value="frontend.mode"/>

            <ext-displayfield :label="l10n(`Backend version`)" :value="'v' + backend.currentVersion"/>
            <ext-displayfield :label="l10n(`Backend mode`)" :value="backend.mode"/>
        </ext-fieldpanel>

        <ext-toolbar docked="bottom" layout='{"pack":"end","type":"hbox"}'>
            <ext-button iconCls="fa-regular fa-copy" :text="l10n(`Copy to clipboard`)" ui="action" @tap="_copy"/>
        </ext-toolbar>
    </ext-dialog>
</template>

<script>
export default {
    "computed": {
        backend () {
            return this.$app.settings.backendGitId || {};
        },

        frontend () {
            return this.$app.settings.frontendGitId || {};
        },
    },

    "methods": {
        _copy () {
            this.$utils.copyToClipboard( JSON.stringify(
                {
                    "backend": this.$app.settings.backendGitId,
                    "frontend": this.$app.settings.frontendGitId,
                },
                null,
                4
            ) );

            this.$utils.toast( this.l10n( "Version info copied" ) );
        },
    },
};
</script>

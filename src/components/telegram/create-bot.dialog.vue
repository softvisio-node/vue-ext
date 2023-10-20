<template>
    <ext-dialog height="500" layout="fit" :title="l10n(`Create Telegram bot`)" width="500">
        <ext-panel ref="cardPanel" layout="card">
            <ext-fieldpanel>
                <ext-textfield :label="l10n(`Enter your Telegram bot API key`)"/>

                <ext-toolbar docked="bottom">
                    <ext-spacer/>
                    <ext-button :text="l10n(`Next`)" ui="action"/>
                </ext-toolbar>
            </ext-fieldpanel>
        </ext-panel>
    </ext-dialog>
</template>

<script>
export default {
    "methods": {},
};
</script>

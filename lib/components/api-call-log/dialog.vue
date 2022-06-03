<template>
    <ext-dialog :title="i18n(`API Call Log`)" width="95%" height="95%" scrollable="true" closeAction="hide" layout="fit">
        <Panel/>
    </ext-dialog>
</template>

<script>
import Panel from "./panel";

export default {
    "components": { Panel },
};
</script>

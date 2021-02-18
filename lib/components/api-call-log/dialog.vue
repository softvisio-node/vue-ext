<template>
    <ext-dialog title="API Call Log" width="95%" height="95%" scrollable="true" closable="true" draggable="false" closeAction="hide" hideOnMaskTap="true" layout="fit">
        <Panel/>
    </ext-dialog>
</template>

<script>
import Panel from "./panel";

export default {
    "components": { Panel },
};
</script>
